Eres un desarrollador senior. Trabajas en ODIN POS (Next.js App Router + TypeScript). El proyecto ya tiene Sidebar dinámico por modo/perfil usando `enabledModules` (config) y renderiza módulos con `label`, `route`, `icon`. Debes implementar un módulo nuevo llamado `Giftcards` accesible desde el panel admin en TODOS los perfiles (Restaurante, Spa/Salón, Ferretería, etc.), con variaciones de copy/UX según el modo, pero compartiendo la misma ruta: `/admin/giftcards`.

OBJETIVO:
- Crear el módulo completo con UI y lógica base (sin necesidad de backend real, pero con estructura lista para conectar).
- Integrarlo a `enabledModules` en todos los modos.
- Mantener consistencia con el patrón de layouts, components y services actuales.

REQUISITOS DE IMPLEMENTACIÓN:

1) REGISTRAR EL MÓDULO EN CONFIGURACIÓN (TODOS LOS MODOS)
- Ubica donde se definen los modos (restaurant/spa/hardware/etc.) y la lista `enabledModules` que consume `AdminSidebar`.
- Agrega un módulo:
  - key: "giftcards" (o similar consistente)
  - label: dinámico según modo:
    - restaurant/bar: "Giftcards"
    - spa/salon: "Tarjetas de Regalo"
    - hardware/retail: "Giftcard / Crédito"
  - route: "/admin/giftcards"
  - icon: usa un icono existente de tu set (ej: Gift, CreditCard, Award, Ticket). Si usas lucide-react, elige uno disponible.
- Debe aparecer en el Sidebar sin romper tipos TS.

2) RUTA Y ESTRUCTURA APP ROUTER
Crea:
- `app/(admin)/admin/giftcards/page.tsx` (o donde estén las rutas admin reales en tu proyecto)
- Si el admin layout ya existe, reutilízalo (no dupliques `<html><body>`).

3) PÁGINA PRINCIPAL: LISTADO + RESUMEN
En `/admin/giftcards` implementa:
- Header: "Giftcards" (o label por modo)
- KPIs (cards): saldo pendiente, vendidas mes, redenciones mes, recargas mes
- Tabla con filtros:
  - búsqueda (código/cliente)
  - estado (Activa/Agotada/Expirada/Anulada)
  - tipo (Digital/Física)
  - rango de fecha (opcional simple)
- Tabla columnas:
  - Código, Cliente/Beneficiario, Tipo, Estado (badge), Saldo, Monto Inicial, Expira, Acciones
- Acciones fila: Ver, Recargar, Redimir, Anular, Imprimir/Enviar (por ahora placeholders)
- Botón principal: "Crear Giftcard"

4) PANTALLAS / COMPONENTES DEL MÓDULO
Crea componentes en `app/components` o `components` (según tu estructura actual), por ejemplo:
- `GiftcardsDashboard.tsx` (listado)
- `GiftcardCreateModal.tsx`
- `GiftcardRedeemModal.tsx`
- `GiftcardRechargeModal.tsx`
- `GiftcardDetailDrawer` o `GiftcardDetailModal` (detalle + historial)
- `GiftcardReportsTab.tsx` (opcional en tabs)
Usa el mismo patrón de UI que ya emplea Inventario/Ventas: cards, table, modal, badges.

5) DATA MODEL (FRONTEND) + SERVICIO SIMULADO
Define tipos TS:
- GiftcardStatus = "ACTIVE" | "DEPLETED" | "EXPIRED" | "VOIDED"
- GiftcardType = "DIGITAL" | "PHYSICAL"
- Giftcard {
   id, code, beneficiaryName, beneficiaryPhone?, beneficiaryEmail?,
   type, status, initialAmount, balance, currency,
   expiresAt?, createdAt, createdBy
 }
- GiftcardMovement {
   id, giftcardId, type: "SALE"|"REDEEM"|"RECHARGE"|"VOID"|"ADJUST",
   amount, reference?, createdAt, createdBy
 }
Crea un service de frontend (siguiendo el patrón existente, por ejemplo `services/...`):
- `giftcardService.ts` con funciones async:
  - listGiftcards(filters)
  - createGiftcard(payload)
  - redeemGiftcard(code, amount, context?)
  - rechargeGiftcard(code, amount, mode)
  - voidGiftcard(code, reason?)
  - getGiftcardByCode(code)
  - listMovements(giftcardId)
Implementa con datos mock en memoria (o mock JSON) para que el módulo funcione sin backend.

6) VARIACIONES POR MODO (UX/COPY)
Detecta el modo actual igual que el proyecto ya lo hace (ej: configService / context / pathname / store):
- Restaurant: en Redimir mostrar selector de contexto: Mesa / Orden rápida / Delivery (solo UI)
- Spa: en Crear permitir “Monto libre” o “Paquete” (paquete como select mock)
- Ferretería: renombrar internamente a “Crédito de tienda”; en Redimir mostrar toggle “Devolución a Giftcard” (UI placeholder)
No cambies la ruta; solo cambia labels, campos opcionales y textos.

7) PERMISOS (FRONTEND)
Si el proyecto tiene roles (admin/cajero):
- Admin: puede anular y ajustar
- Cajero: puede vender/redimir/recargar
Si no existe sistema de roles, crea un `can(user, action)` básico (placeholder) y deja listo para conectar.

8) ESTADOS Y VALIDACIONES
- No permitir redimir si status != ACTIVE
- Si balance - amount <= 0 => status pasa a DEPLETED
- Si expiresAt < hoy => status EXPIRED
- Void => status VOIDED (sin redimir/recargar)
- Permitir redención parcial

9) CALIDAD
- TypeScript estricto, componentes client cuando aplique (`"use client"`)
- Evita romper el build
- Respeta convenciones del repo: rutas, imports con alias, estructura de layouts
- No uses dependencias nuevas salvo que ya existan

ENTREGABLE:
- Cambios listos en el código con archivos nuevos + modificaciones en config/sidebar
- Módulo visible desde el Sidebar en todos los perfiles
- `/admin/giftcards` funcional con mock data y modales (crear/redimir/recargar/detalle)

Devuélveme:
1) Lista de archivos creados/modificados
2) Código completo de cada archivo nuevo/modificado (sin omitir partes)
3) Notas de cómo probar rápidamente en local