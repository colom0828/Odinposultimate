/**
 * ═══════════════════════════════════════════════════════════════
 * EJEMPLO: TenantMiddleware.cs para ASP.NET Core
 * ═══════════════════════════════════════════════════════════════
 * Este archivo es un EJEMPLO de cómo implementar el middleware
 * para resolver el tenant por request en el backend.
 * 
 * Ubicación sugerida: Backend/Infrastructure/Tenancy/TenantMiddleware.cs
 */

using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System.Threading.Tasks;

namespace OdinPOS.Infrastructure.Tenancy
{
    /// <summary>
    /// Middleware que resuelve el tenant actual por request
    /// basado en el claim tenant_id del JWT
    /// </summary>
    public class TenantMiddleware
    {
        private readonly RequestDelegate _next;

        // Rutas que NO requieren tenant (excluidas del middleware)
        private readonly string[] _excludedPaths = new[]
        {
            "/api/auth/login",
            "/api/auth/register",
            "/health",
            "/swagger"
        };

        public TenantMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(
            HttpContext context,
            ITenantResolver tenantResolver,
            TenantContext tenantContext)
        {
            // Excluir rutas públicas
            if (IsExcludedPath(context.Request.Path))
            {
                await _next(context);
                return;
            }

            // Resolver tenant del JWT
            try
            {
                var tenantInfo = await tenantResolver.ResolveAsync(context);

                if (tenantInfo == null)
                {
                    context.Response.StatusCode = 401;
                    await context.Response.WriteAsJsonAsync(new
                    {
                        message = "Token inválido: falta claim tenant_id"
                    });
                    return;
                }

                // Validar estado del tenant
                if (tenantInfo.Status != TenantStatus.Active)
                {
                    context.Response.StatusCode = 403;
                    await context.Response.WriteAsJsonAsync(new
                    {
                        message = $"Tenant '{tenantInfo.TenantId}' está {tenantInfo.Status}. Contacte al administrador."
                    });
                    return;
                }

                // Asignar tenant al contexto (scoped)
                tenantContext.Current = tenantInfo;
                tenantContext.ConnectionString = tenantInfo.BuildConnectionString();

                // Continuar pipeline
                await _next(context);
            }
            catch (TenantNotFoundException ex)
            {
                context.Response.StatusCode = 403;
                await context.Response.WriteAsJsonAsync(new
                {
                    message = ex.Message
                });
            }
            catch (Exception ex)
            {
                // Log error
                Console.WriteLine($"Error en TenantMiddleware: {ex.Message}");

                context.Response.StatusCode = 500;
                await context.Response.WriteAsJsonAsync(new
                {
                    message = "Error resolviendo tenant"
                });
            }
        }

        private bool IsExcludedPath(PathString path)
        {
            var pathValue = path.Value?.ToLower() ?? "";
            return _excludedPaths.Any(excluded => pathValue.StartsWith(excluded));
        }
    }

    /// <summary>
    /// Extension method para registrar el middleware
    /// </summary>
    public static class TenantMiddlewareExtensions
    {
        public static IApplicationBuilder UseTenantResolution(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<TenantMiddleware>();
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// EJEMPLO: ITenantResolver.cs
// ═══════════════════════════════════════════════════════════════

namespace OdinPOS.Infrastructure.Tenancy
{
    public interface ITenantResolver
    {
        Task<TenantInfo?> ResolveAsync(HttpContext context);
    }
}

// ═══════════════════════════════════════════════════════════════
// EJEMPLO: TenantResolver.cs
// ═══════════════════════════════════════════════════════════════

using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace OdinPOS.Infrastructure.Tenancy
{
    public class TenantResolver : ITenantResolver
    {
        private readonly MasterDbContext _masterDb;
        private readonly ILogger<TenantResolver> _logger;

        public TenantResolver(MasterDbContext masterDb, ILogger<TenantResolver> logger)
        {
            _masterDb = masterDb;
            _logger = logger;
        }

        public async Task<TenantInfo?> ResolveAsync(HttpContext context)
        {
            // 1. Leer tenant_id del JWT
            var tenantId = context.User.FindFirst("tenant_id")?.Value;

            if (string.IsNullOrEmpty(tenantId))
            {
                _logger.LogWarning("Request sin claim tenant_id");
                return null;
            }

            // 2. Buscar tenant en master database
            var tenant = await _masterDb.Tenants
                .Where(t => t.TenantId == tenantId)
                .FirstOrDefaultAsync();

            if (tenant == null)
            {
                _logger.LogError($"Tenant '{tenantId}' no encontrado en master");
                throw new TenantNotFoundException($"Tenant '{tenantId}' no encontrado");
            }

            // 3. Mapear a TenantInfo
            return new TenantInfo
            {
                Id = tenant.Id,
                TenantId = tenant.TenantId,
                Name = tenant.Name,
                DbName = tenant.DbName,
                DbHost = tenant.DbHost,
                DbPort = tenant.DbPort,
                DbUser = tenant.DbUser,
                DbPassword = tenant.DbPassword,
                Status = tenant.Status
            };
        }
    }

    public class TenantNotFoundException : Exception
    {
        public TenantNotFoundException(string message) : base(message) { }
    }
}

// ═══════════════════════════════════════════════════════════════
// EJEMPLO: TenantContext.cs (Scoped)
// ═══════════════════════════════════════════════════════════════

namespace OdinPOS.Infrastructure.Tenancy
{
    /// <summary>
    /// Contexto del tenant actual (scoped por request)
    /// Similar a HttpContext, pero para el tenant
    /// </summary>
    public class TenantContext
    {
        public TenantInfo? Current { get; set; }
        public string? ConnectionString { get; set; }

        public bool HasTenant => Current != null;

        public string GetTenantIdOrThrow()
        {
            if (Current == null)
            {
                throw new InvalidOperationException("No hay tenant activo en el contexto");
            }
            return Current.TenantId;
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// EJEMPLO: TenantInfo.cs
// ═══════════════════════════════════════════════════════════════

namespace OdinPOS.Infrastructure.Tenancy
{
    public class TenantInfo
    {
        public Guid Id { get; set; }
        public string TenantId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string DbName { get; set; } = string.Empty;
        public string DbHost { get; set; } = string.Empty;
        public int DbPort { get; set; }
        public string DbUser { get; set; } = string.Empty;
        public string DbPassword { get; set; } = string.Empty;
        public TenantStatus Status { get; set; }

        public string BuildConnectionString()
        {
            return $"Host={DbHost};Port={DbPort};Database={DbName};Username={DbUser};Password={DbPassword};";
        }
    }

    public enum TenantStatus
    {
        Active,
        Inactive,
        Suspended,
        Provisioning,
        Migrating,
        Error
    }
}

// ═══════════════════════════════════════════════════════════════
// EJEMPLO: Program.cs (Registrar servicios)
// ═══════════════════════════════════════════════════════════════

/*
using OdinPOS.Infrastructure.Tenancy;
using OdinPOS.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// 1. Registrar Master DbContext (connection string fijo)
builder.Services.AddDbContext<MasterDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("MasterDatabase")));

// 2. Registrar servicios de tenancy (SCOPED)
builder.Services.AddScoped<TenantContext>();
builder.Services.AddScoped<ITenantResolver, TenantResolver>();

// 3. Registrar Tenant DbContext (con factory dinámico)
builder.Services.AddDbContext<TenantDbContext>((serviceProvider, options) =>
{
    var tenantContext = serviceProvider.GetRequiredService<TenantContext>();
    
    if (string.IsNullOrEmpty(tenantContext.ConnectionString))
    {
        throw new InvalidOperationException("No hay connection string del tenant");
    }
    
    options.UseNpgsql(tenantContext.ConnectionString);
});

// ... otros servicios

var app = builder.Build();

// 4. Registrar middleware en el orden correcto
app.UseAuthentication();      // 1º JWT validation
app.UseTenantResolution();    // 2º Tenant resolution (DESPUÉS de auth)
app.UseAuthorization();       // 3º Authorization
app.MapControllers();

app.Run();
*/

// ═══════════════════════════════════════════════════════════════
// EJEMPLO: Uso en Controller
// ═══════════════════════════════════════════════════════════════

/*
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace OdinPOS.Features.Products
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]  // Requiere JWT válido
    public class ProductsController : ControllerBase
    {
        private readonly TenantDbContext _db;
        private readonly TenantContext _tenantContext;

        public ProductsController(TenantDbContext db, TenantContext tenantContext)
        {
            _db = db;
            _tenantContext = tenantContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            // El TenantDbContext YA está conectado a la BD del tenant
            // gracias al TenantMiddleware que se ejecutó antes
            
            var products = await _db.Products.ToListAsync();
            
            // Logs para debugging
            Console.WriteLine($"Tenant: {_tenantContext.Current?.TenantId}");
            Console.WriteLine($"DB: {_tenantContext.Current?.DbName}");
            Console.WriteLine($"Products: {products.Count}");
            
            return Ok(new { products, total = products.Count });
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductRequest request)
        {
            var product = new Product
            {
                Name = request.Name,
                Price = request.Price,
                // NO necesitas agregar TenantId aquí
                // porque la BD ya es del tenant
            };

            _db.Products.Add(product);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProducts), new { id = product.Id }, product);
        }
    }
}
*/
