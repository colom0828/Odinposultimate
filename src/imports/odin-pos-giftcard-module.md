Prompt para Figma (1 solo texto)

Crea y agrega un nuevo módulo llamado “Giftcard / Tarjetas de Regalo” dentro del sistema ODIN POS (admin web app). El sistema ya tiene Sidebar dinámico por tipo de negocio (Restaurante, Spa/Salón, Ferretería y otros), por lo tanto este módulo debe existir y mostrarse en TODOS los perfiles, pero con variaciones funcionales y de contenido según el tipo de empresa.

Objetivo del módulo: Innovar el POS con un sistema completo de Giftcards que permita emitir, vender, recargar, redimir y auditar tarjetas de regalo (digital y física), con integración directa al flujo de ventas/caja.

1) Integración en navegación

Agregar en el Sidebar un item nuevo en todos los modos:

Nombre (label) por modo:

Restaurante/Bar/Café/FastFood: “Giftcards”

Spa/Salón/Uñas: “Tarjetas de Regalo”

Ferretería/Retail/Mayorista: “Giftcard / Crédito”

Ruta única: /admin/giftcards

Icono: usa un icono tipo “Award / CreditCard / Gift” (el que se vea más consistente con el resto del sistema).

Colócalo cerca de Ventas/Caja (después de “Ventas” o “Caja registradora”).

2) Pantallas necesarias (dentro de /admin/giftcards)

Diseña el módulo con estética consistente con ODIN POS: layout admin con header, sidebar, tarjetas resumen arriba, tablas con filtros, modales para acciones, y estados claros (activo, agotado, expirado, anulado).

A) Giftcards — Home (Listado + Resumen)

Cards KPI arriba:

“Saldo total pendiente (liabilidad)”

“Giftcards vendidas (mes)”

“Redenciones (mes)”

“Recargas (mes)”

Tabla principal con columnas:

Código/QR

Cliente/Beneficiario

Tipo (Digital/Física)

Estado (Activa/Agotada/Expirada/Anulada)

Saldo actual

Monto inicial

Expira

Creada por

Acciones (Ver, Recargar, Redimir, Anular, Imprimir/Enviar)

Filtros:

Buscar por código/cliente/teléfono

Estado

Rango de fecha (creación/redención)

Tipo (Digital/Física)

Botón principal: “Crear Giftcard”

B) Crear Giftcard (Formulario + Preview)

Formulario con:

Monto inicial

Moneda (usa moneda base del negocio)

Expiración (opcional, con fecha)

Tipo: Digital / Física

Beneficiario (nombre, teléfono, email)

Mensaje personalizado (para digital)

Método de venta: “Se vende ahora” (genera venta en caja) o “Solo registrar” (para emisión administrativa)

Preview de tarjeta:

Código visible

QR/Barcode

Branding ODIN POS
Acción final: Crear y (opcional) imprimir / enviar por WhatsApp/email

C) Detalle de Giftcard (Perfil + Historial)

Vista con:

Datos generales (código, estado, saldo, expiración, beneficiario)

Botones rápidos: Recargar, Redimir, Anular, Imprimir/Enviar, Ver movimientos

Historial en tabla:

Fecha

Tipo (Venta/Recarga/Redención/Anulación/Ajuste)

Monto (+/-)

Referencia (Ticket/Factura/Orden)

Usuario

D) Redimir Giftcard (Modal/Flujo)

Input para escanear/pegar código

Muestra saldo disponible y estado

Permitir redención parcial (monto a aplicar)

Confirmación y registro del movimiento

Mensajes de error:

Expirada

Anulada

Saldo insuficiente

Código inválido

E) Recargar Giftcard (Modal)

Monto a recargar

Método: “Recarga por venta en caja” o “Ajuste administrativo” (con razón)

Registro en historial

F) Reportes Giftcard (Subsección o tab)

Gráficas simples y tabla:

Vendidas vs Redimidas

Saldo pendiente (liabilidad)

Top clientes

Top sucursales (si aplica)

3) Variantes por tipo de negocio (DEBE cambiar UX/copy y opciones)
Restaurante / Bar

En redimir, permitir aplicar a:

“Mesa”

“Orden rápida”

“Delivery”

Mostrar opción “Aplicar a propina” (toggle opcional) si existe flujo de propina.

Copy enfocado a consumo en local y pedidos.

Spa / Salón / Uñas

En crear, permitir seleccionar:

Giftcard por “Monto libre” o “Paquete de servicios” (ej: Manicure + Pedicure).

En redimir, permitir aplicar a:

“Cita/Reserva”

“Servicio facturado en POS”

Copy enfocado a regalar experiencias/servicios.

Ferretería / Retail

Renombrar internamente como “Giftcard / Crédito de tienda”.

En redimir, permitir:

Aplicar a “Factura de productos”

Opción “Devolución a Giftcard” (para casos de refund como crédito)

Copy enfocado a crédito para compras de productos.

4) Reglas y estados

Estados obligatorios: Activa, Agotada (saldo 0), Expirada, Anulada

Permitir redención parcial y múltiples movimientos

Registrar auditoría (usuario, fecha, referencia de venta)

Permisos (visual): Admin puede anular/ajustar; cajero solo vender/redimir

5) Consistencia visual

Mantén el estilo del admin actual (cards, tablas, modales, badges de estado).

Usa componentes repetibles (tablas y modales similares a Inventario/Ventas/Caja).

Todo debe ser responsive (desktop primero).

Entrega como nuevas pantallas dentro del flujo admin y enlazadas desde el Sidebar para cada modo de negocio.