/**
 * ═══════════════════════════════════════════════════════════════
 * BACKEND ENDPOINTS - ASP.NET CORE
 * ═══════════════════════════════════════════════════════════════
 * Endpoints completos para implementar en el backend
 */

// ============================================================
// CONTROLLERS A IMPLEMENTAR
// ============================================================

/*
┌─────────────────────────────────────────────────────────────┐
│ 1. PrintTemplatesController.cs                              │
└─────────────────────────────────────────────────────────────┘
*/

[ApiController]
[Route("api/templates")]
[Authorize]
public class PrintTemplatesController : ControllerBase
{
    private readonly IPrintTemplateService _templateService;

    // GET /api/templates
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? type = null,
        [FromQuery] bool? isActive = null)
    {
        var templates = await _templateService.GetAllAsync(type, isActive);
        return Ok(templates);
    }

    // GET /api/templates/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var template = await _templateService.GetByIdAsync(id);
        
        if (template == null)
            return NotFound(new { message = "Plantilla no encontrada" });
            
        return Ok(template);
    }

    // POST /api/templates
    [HttpPost]
    [Authorize(Policy = "CanManagePrintTemplates")]
    public async Task<IActionResult> Create([FromBody] CreateTemplateDto dto)
    {
        // Validar
        var validation = await _templateService.ValidateAsync(dto);
        if (!validation.IsValid)
            return BadRequest(new { errors = validation.Errors });

        // Crear
        var template = await _templateService.CreateAsync(dto, User.GetUserId());
        
        return CreatedAtAction(
            nameof(GetById), 
            new { id = template.Id }, 
            template
        );
    }

    // PUT /api/templates/{id}
    [HttpPut("{id}")]
    [Authorize(Policy = "CanManagePrintTemplates")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTemplateDto dto)
    {
        if (id != dto.Id)
            return BadRequest(new { message = "ID no coincide" });

        // Validar
        var validation = await _templateService.ValidateAsync(dto);
        if (!validation.IsValid)
            return BadRequest(new { errors = validation.Errors });

        // Actualizar
        var template = await _templateService.UpdateAsync(dto, User.GetUserId());
        
        if (template == null)
            return NotFound(new { message = "Plantilla no encontrada" });
            
        return Ok(template);
    }

    // DELETE /api/templates/{id}
    [HttpDelete("{id}")]
    [Authorize(Policy = "CanManagePrintTemplates")]
    public async Task<IActionResult> Delete(Guid id)
    {
        // Verificar que no sea plantilla por defecto
        var template = await _templateService.GetByIdAsync(id);
        if (template == null)
            return NotFound(new { message = "Plantilla no encontrada" });
            
        if (template.IsDefault)
            return BadRequest(new { message = "No se puede eliminar una plantilla por defecto" });

        await _templateService.DeleteAsync(id);
        return NoContent();
    }

    // POST /api/templates/{id}/duplicate
    [HttpPost("{id}/duplicate")]
    [Authorize(Policy = "CanManagePrintTemplates")]
    public async Task<IActionResult> Duplicate(Guid id, [FromBody] DuplicateTemplateDto dto)
    {
        var template = await _templateService.DuplicateAsync(id, dto.NewName, User.GetUserId());
        
        if (template == null)
            return NotFound(new { message = "Plantilla no encontrada" });
            
        return CreatedAtAction(
            nameof(GetById), 
            new { id = template.Id }, 
            template
        );
    }

    // GET /api/templates/{id}/history
    [HttpGet("{id}/history")]
    public async Task<IActionResult> GetHistory(Guid id, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var history = await _templateService.GetHistoryAsync(id, page, pageSize);
        return Ok(history);
    }
}

/*
┌─────────────────────────────────────────────────────────────┐
│ 2. ClientTemplateOverridesController.cs                     │
└─────────────────────────────────────────────────────────────┘
*/

[ApiController]
[Route("api/overrides")]
[Authorize]
public class ClientTemplateOverridesController : ControllerBase
{
    private readonly IClientOverrideService _overrideService;

    // GET /api/overrides
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] Guid? clientId = null,
        [FromQuery] Guid? templateId = null)
    {
        var overrides = await _overrideService.GetAllAsync(clientId, templateId);
        return Ok(overrides);
    }

    // GET /api/overrides/client/{clientId}/template/{templateId}
    [HttpGet("client/{clientId}/template/{templateId}")]
    public async Task<IActionResult> GetByClientAndTemplate(Guid clientId, Guid templateId)
    {
        var override = await _overrideService.GetByClientAndTemplateAsync(clientId, templateId);
        
        if (override == null)
            return NotFound(new { message = "Override no encontrado" });
            
        return Ok(override);
    }

    // POST /api/overrides
    [HttpPost]
    [Authorize(Policy = "CanManageClientOverrides")]
    public async Task<IActionResult> Create([FromBody] CreateOverrideDto dto)
    {
        var override = await _overrideService.CreateAsync(dto, User.GetUserId());
        return CreatedAtAction(
            nameof(GetByClientAndTemplate), 
            new { clientId = override.ClientId, templateId = override.TemplateId }, 
            override
        );
    }

    // PUT /api/overrides/{id}
    [HttpPut("{id}")]
    [Authorize(Policy = "CanManageClientOverrides")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateOverrideDto dto)
    {
        if (id != dto.Id)
            return BadRequest(new { message = "ID no coincide" });

        var override = await _overrideService.UpdateAsync(dto);
        
        if (override == null)
            return NotFound(new { message = "Override no encontrado" });
            
        return Ok(override);
    }

    // DELETE /api/overrides/{id}
    [HttpDelete("{id}")]
    [Authorize(Policy = "CanManageClientOverrides")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _overrideService.DeleteAsync(id);
        return NoContent();
    }
}

/*
┌─────────────────────────────────────────────────────────────┐
│ 3. PrintRenderController.cs                                 │
└─────────────────────────────────────────────────────────────┘
*/

[ApiController]
[Route("api/print")]
[Authorize]
public class PrintRenderController : ControllerBase
{
    private readonly IRenderService _renderService;

    // POST /api/print/render
    [HttpPost("render")]
    public async Task<IActionResult> Render([FromBody] RenderTemplateRequest request)
    {
        try
        {
            // Validar datos
            var validation = await _renderService.ValidateDataAsync(request.Data);
            if (!validation.IsValid)
                return BadRequest(new { errors = validation.Errors });

            // Renderizar
            var result = await _renderService.RenderAsync(request);
            
            return Ok(result);
        }
        catch (TemplateNotFoundException)
        {
            return NotFound(new { message = "Plantilla no encontrada" });
        }
        catch (InvalidDataException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // POST /api/print/render/html
    [HttpPost("render/html")]
    public async Task<IActionResult> RenderHtml([FromBody] RenderTemplateRequest request)
    {
        request.Format = "html";
        var result = await _renderService.RenderAsync(request);
        return Content(result.Content, "text/html");
    }

    // POST /api/print/render/pdf
    [HttpPost("render/pdf")]
    public async Task<IActionResult> RenderPdf([FromBody] RenderTemplateRequest request)
    {
        request.Format = "pdf";
        var result = await _renderService.RenderAsync(request);
        
        var pdfBytes = Convert.FromBase64String(result.Content);
        return File(pdfBytes, "application/pdf", "ticket.pdf");
    }

    // POST /api/print/render/escpos
    [HttpPost("render/escpos")]
    public async Task<IActionResult> RenderEscPos([FromBody] RenderTemplateRequest request)
    {
        request.Format = "raw";
        var result = await _renderService.RenderAsync(request);
        
        // Devolver comandos ESC/POS como bytes
        var commands = Convert.FromBase64String(result.Content);
        return File(commands, "application/octet-stream", "print_commands.bin");
    }

    // POST /api/print/preview
    [HttpPost("preview")]
    public async Task<IActionResult> Preview([FromBody] PreviewRequest request)
    {
        // Generar preview sin validaciones estrictas
        var result = await _renderService.GeneratePreviewAsync(request);
        return Ok(result);
    }
}

// ============================================================
// DTOs (Data Transfer Objects)
// ============================================================

public class CreateTemplateDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Type { get; set; } = string.Empty;
    public int PaperWidth { get; set; }
    public string PaperType { get; set; } = string.Empty;
    public List<BlockConfig> Blocks { get; set; } = new();
}

public class UpdateTemplateDto
{
    public Guid Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Type { get; set; }
    public int? PaperWidth { get; set; }
    public string? PaperType { get; set; }
    public List<BlockConfig>? Blocks { get; set; }
    public bool? IsActive { get; set; }
}

public class DuplicateTemplateDto
{
    public string NewName { get; set; } = string.Empty;
}

public class CreateOverrideDto
{
    public Guid ClientId { get; set; }
    public Guid TemplateId { get; set; }
    public List<OverrideChange> Overrides { get; set; } = new();
}

public class UpdateOverrideDto
{
    public Guid Id { get; set; }
    public List<OverrideChange> Overrides { get; set; } = new();
    public bool? IsActive { get; set; }
}

public class OverrideChange
{
    public string BlockId { get; set; } = string.Empty;
    public Dictionary<string, object> Changes { get; set; } = new();
}

public class RenderTemplateRequest
{
    public Guid TemplateId { get; set; }
    public Guid? ClientId { get; set; }
    public PrintData Data { get; set; } = new();
    public string Format { get; set; } = "html"; // html, pdf, raw
}

public class PreviewRequest
{
    public List<BlockConfig> Blocks { get; set; } = new();
    public PrintData Data { get; set; } = new();
    public int PaperWidth { get; set; }
}

// ============================================================
// SERVICIOS (Interfaces)
// ============================================================

public interface IPrintTemplateService
{
    Task<List<PrintTemplate>> GetAllAsync(string? type, bool? isActive);
    Task<PrintTemplate?> GetByIdAsync(Guid id);
    Task<PrintTemplate> CreateAsync(CreateTemplateDto dto, Guid userId);
    Task<PrintTemplate?> UpdateAsync(UpdateTemplateDto dto, Guid userId);
    Task DeleteAsync(Guid id);
    Task<PrintTemplate?> DuplicateAsync(Guid id, string newName, Guid userId);
    Task<List<TemplateHistory>> GetHistoryAsync(Guid id, int page, int pageSize);
    Task<ValidationResult> ValidateAsync(object dto);
}

public interface IClientOverrideService
{
    Task<List<ClientTemplateOverride>> GetAllAsync(Guid? clientId, Guid? templateId);
    Task<ClientTemplateOverride?> GetByClientAndTemplateAsync(Guid clientId, Guid templateId);
    Task<ClientTemplateOverride> CreateAsync(CreateOverrideDto dto, Guid userId);
    Task<ClientTemplateOverride?> UpdateAsync(UpdateOverrideDto dto);
    Task DeleteAsync(Guid id);
}

public interface IRenderService
{
    Task<RenderResult> RenderAsync(RenderTemplateRequest request);
    Task<RenderResult> GeneratePreviewAsync(PreviewRequest request);
    Task<ValidationResult> ValidateDataAsync(PrintData data);
}

// ============================================================
// POLÍTICAS DE AUTORIZACIÓN
// ============================================================

public static class AuthPolicies
{
    public const string CanManagePrintTemplates = "CanManagePrintTemplates";
    public const string CanManageClientOverrides = "CanManageClientOverrides";
}

// En Program.cs o Startup.cs
services.AddAuthorization(options =>
{
    options.AddPolicy(AuthPolicies.CanManagePrintTemplates, policy =>
        policy.RequireClaim("permission", "manage_print_templates"));
        
    options.AddPolicy(AuthPolicies.CanManageClientOverrides, policy =>
        policy.RequireClaim("permission", "manage_client_overrides"));
});

// ============================================================
// VALIDADORES (FluentValidation)
// ============================================================

public class CreateTemplateDtoValidator : AbstractValidator<CreateTemplateDto>
{
    public CreateTemplateDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("El nombre es obligatorio")
            .MaximumLength(200).WithMessage("El nombre no puede exceder 200 caracteres");

        RuleFor(x => x.Type)
            .NotEmpty().WithMessage("El tipo es obligatorio")
            .Must(BeValidType).WithMessage("Tipo de plantilla inválido");

        RuleFor(x => x.PaperWidth)
            .Must(x => x == 58 || x == 80 || x == 110)
            .WithMessage("Ancho de papel debe ser 58, 80 o 110mm");

        RuleFor(x => x.PaperType)
            .Must(x => x == "thermal" || x == "a4" || x == "letter")
            .WithMessage("Tipo de papel inválido");

        RuleFor(x => x.Blocks)
            .NotEmpty().WithMessage("Debe haber al menos un bloque")
            .Must(HaveRequiredBlocks).WithMessage("Debe tener bloques 'items' y 'totals'");
    }

    private bool BeValidType(string type)
    {
        var validTypes = new[] { "invoice", "ticket", "kitchen_order", "bar_order", "delivery_receipt" };
        return validTypes.Contains(type);
    }

    private bool HaveRequiredBlocks(List<BlockConfig> blocks)
    {
        return blocks.Any(b => b.Type == "items") && blocks.Any(b => b.Type == "totals");
    }
}

// ============================================================
// REPOSITORIOS (Entity Framework Core)
// ============================================================

public class PrintTemplateRepository : IPrintTemplateRepository
{
    private readonly ApplicationDbContext _context;

    public PrintTemplateRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<PrintTemplate>> GetAllAsync(string? type, bool? isActive)
    {
        var query = _context.PrintTemplates.AsQueryable();

        if (!string.IsNullOrEmpty(type))
            query = query.Where(t => t.Type == type);

        if (isActive.HasValue)
            query = query.Where(t => t.IsActive == isActive.Value);

        return await query
            .OrderBy(t => t.Name)
            .ToListAsync();
    }

    public async Task<PrintTemplate?> GetByIdAsync(Guid id)
    {
        return await _context.PrintTemplates
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<PrintTemplate> CreateAsync(PrintTemplate template)
    {
        _context.PrintTemplates.Add(template);
        await _context.SaveChangesAsync();
        
        // Guardar en historial
        await SaveHistoryAsync(template.Id, template, "Creación inicial");
        
        return template;
    }

    public async Task<PrintTemplate?> UpdateAsync(PrintTemplate template)
    {
        _context.PrintTemplates.Update(template);
        await _context.SaveChangesAsync();
        
        // Guardar en historial
        await SaveHistoryAsync(template.Id, template, "Actualización");
        
        return template;
    }

    public async Task DeleteAsync(Guid id)
    {
        var template = await GetByIdAsync(id);
        if (template != null)
        {
            _context.PrintTemplates.Remove(template);
            await _context.SaveChangesAsync();
        }
    }

    private async Task SaveHistoryAsync(Guid templateId, PrintTemplate template, string description)
    {
        var history = new TemplateHistory
        {
            Id = Guid.NewGuid(),
            TemplateId = templateId,
            Snapshot = JsonSerializer.Serialize(template),
            ChangedBy = template.CreatedBy,
            ChangedAt = DateTime.UtcNow,
            ChangeDescription = description
        };

        _context.TemplateHistory.Add(history);
        await _context.SaveChangesAsync();
    }
}

// ============================================================
// CONFIGURACIÓN ENTITY FRAMEWORK
// ============================================================

public class ApplicationDbContext : DbContext
{
    public DbSet<PrintTemplate> PrintTemplates { get; set; }
    public DbSet<ClientTemplateOverride> ClientTemplateOverrides { get; set; }
    public DbSet<TemplateHistory> TemplateHistory { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PrintTemplate>(entity =>
        {
            entity.ToTable("print_templates");
            entity.HasKey(e => e.Id);
            
            entity.Property(e => e.Name)
                .HasMaxLength(200)
                .IsRequired();
                
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .IsRequired();
                
            entity.Property(e => e.Blocks)
                .HasColumnType("jsonb")
                .IsRequired();
                
            entity.HasIndex(e => e.Type);
            entity.HasIndex(e => e.IsActive);
        });

        modelBuilder.Entity<ClientTemplateOverride>(entity =>
        {
            entity.ToTable("client_template_overrides");
            entity.HasKey(e => e.Id);
            
            entity.Property(e => e.Overrides)
                .HasColumnType("jsonb")
                .IsRequired();
                
            entity.HasOne<PrintTemplate>()
                .WithMany()
                .HasForeignKey(e => e.TemplateId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasIndex(e => new { e.ClientId, e.TemplateId })
                .IsUnique();
        });

        modelBuilder.Entity<TemplateHistory>(entity =>
        {
            entity.ToTable("template_history");
            entity.HasKey(e => e.Id);
            
            entity.Property(e => e.Snapshot)
                .HasColumnType("jsonb")
                .IsRequired();
                
            entity.HasOne<PrintTemplate>()
                .WithMany()
                .HasForeignKey(e => e.TemplateId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasIndex(e => e.TemplateId);
            entity.HasIndex(e => e.ChangedAt);
        });
    }
}
