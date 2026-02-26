-- ═══════════════════════════════════════════════════════════════
-- EDITOR DE PLANTILLAS DE IMPRESIÓN - SCHEMA POSTGRESQL
-- ═══════════════════════════════════════════════════════════════
-- Sistema para editar facturas, tickets y comandas sin tocar código
-- Para futura implementación con ASP.NET Core + PostgreSQL
-- ═══════════════════════════════════════════════════════════════

-- ============================================================
-- TABLA: print_templates (Plantillas Base)
-- ============================================================
CREATE TABLE print_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- 'invoice', 'ticket', 'kitchen_order', etc.
    
    -- Configuración de papel
    paper_width INTEGER NOT NULL DEFAULT 80, -- mm
    paper_type VARCHAR(20) NOT NULL DEFAULT 'thermal', -- 'thermal', 'a4', 'letter'
    
    -- Bloques (JSON Array)
    blocks JSONB NOT NULL DEFAULT '[]',
    
    -- Metadata
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    
    -- Constraints
    CONSTRAINT chk_template_type CHECK (type IN ('invoice', 'ticket', 'kitchen_order', 'bar_order', 'delivery_receipt')),
    CONSTRAINT chk_paper_type CHECK (paper_type IN ('thermal', 'a4', 'letter')),
    CONSTRAINT chk_paper_width CHECK (paper_width IN (58, 80, 110))
);

-- ============================================================
-- TABLA: client_template_overrides (Personalizaciones por Cliente)
-- ============================================================
CREATE TABLE client_template_overrides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    template_id UUID NOT NULL REFERENCES print_templates(id) ON DELETE CASCADE,
    
    -- Solo diferencias (JSON Array)
    overrides JSONB NOT NULL DEFAULT '[]',
    
    -- Metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Un cliente solo puede tener un override por plantilla
    CONSTRAINT uk_client_template UNIQUE (client_id, template_id)
);

-- ============================================================
-- TABLA: template_history (Historial de Cambios)
-- ============================================================
CREATE TABLE template_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES print_templates(id) ON DELETE CASCADE,
    
    -- Snapshot completo de la plantilla
    snapshot JSONB NOT NULL,
    
    -- Metadata
    changed_by UUID REFERENCES users(id),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    change_description TEXT
);

-- ============================================================
-- ÍNDICES (Performance)
-- ============================================================
CREATE INDEX idx_templates_type ON print_templates(type);
CREATE INDEX idx_templates_active ON print_templates(is_active);
CREATE INDEX idx_templates_default ON print_templates(is_default);
CREATE INDEX idx_overrides_client ON client_template_overrides(client_id);
CREATE INDEX idx_overrides_template ON client_template_overrides(template_id);
CREATE INDEX idx_overrides_active ON client_template_overrides(is_active);
CREATE INDEX idx_history_template ON template_history(template_id);
CREATE INDEX idx_history_changed_at ON template_history(changed_at);

-- GIN index para búsqueda eficiente en JSON
CREATE INDEX idx_templates_blocks_gin ON print_templates USING GIN (blocks);
CREATE INDEX idx_overrides_gin ON client_template_overrides USING GIN (overrides);

-- ============================================================
-- TRIGGERS (Auto-update timestamps)
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON print_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_overrides_updated_at BEFORE UPDATE ON client_template_overrides
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- FUNCIÓN: Aplicar Overrides
-- ============================================================
CREATE OR REPLACE FUNCTION apply_template_overrides(
    p_template_id UUID,
    p_client_id UUID
)
RETURNS JSONB AS $$
DECLARE
    v_template JSONB;
    v_overrides JSONB;
    v_result JSONB;
BEGIN
    -- Obtener plantilla base
    SELECT row_to_json(t.*)::JSONB INTO v_template
    FROM print_templates t
    WHERE t.id = p_template_id AND t.is_active = true;
    
    IF v_template IS NULL THEN
        RAISE EXCEPTION 'Template not found or inactive';
    END IF;
    
    -- Obtener overrides del cliente
    SELECT overrides INTO v_overrides
    FROM client_template_overrides
    WHERE template_id = p_template_id 
      AND client_id = p_client_id 
      AND is_active = true;
    
    -- Si no hay overrides, devolver plantilla original
    IF v_overrides IS NULL THEN
        RETURN v_template;
    END IF;
    
    -- Aplicar overrides (merge profundo)
    v_result := v_template;
    
    -- TODO: Implementar merge de blocks con overrides
    -- Por ahora solo devolvemos la plantilla base
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- DATOS DE EJEMPLO (Plantilla por Defecto)
-- ============================================================
INSERT INTO print_templates (name, description, type, paper_width, paper_type, is_default, blocks) VALUES
('Ticket Térmico Estándar', 'Plantilla por defecto para tickets de venta', 'ticket', 80, 'thermal', true, 
'[
    {
        "id": "block-1",
        "type": "header",
        "label": "Encabezado",
        "order": 0,
        "visible": true,
        "required": true,
        "alignment": "center",
        "fontSize": "lg",
        "fontWeight": "bold",
        "paddingTop": 2,
        "paddingBottom": 2,
        "content": {
            "showLogo": true,
            "showBusinessName": true
        }
    },
    {
        "id": "block-2",
        "type": "business_info",
        "label": "Información del Negocio",
        "order": 1,
        "visible": true,
        "required": false,
        "alignment": "center",
        "fontSize": "sm",
        "fontWeight": "normal",
        "paddingTop": 1,
        "paddingBottom": 2
    },
    {
        "id": "block-3",
        "type": "separator",
        "label": "Separador",
        "order": 2,
        "visible": true,
        "required": false,
        "alignment": "center",
        "fontSize": "sm",
        "fontWeight": "normal",
        "paddingTop": 1,
        "paddingBottom": 1
    },
    {
        "id": "block-4",
        "type": "customer_info",
        "label": "Información del Cliente",
        "order": 3,
        "visible": true,
        "required": false,
        "alignment": "left",
        "fontSize": "sm",
        "fontWeight": "normal",
        "paddingTop": 1,
        "paddingBottom": 1
    },
    {
        "id": "block-5",
        "type": "separator",
        "label": "Separador",
        "order": 4,
        "visible": true,
        "required": false,
        "alignment": "center",
        "fontSize": "sm",
        "fontWeight": "normal",
        "paddingTop": 1,
        "paddingBottom": 1
    },
    {
        "id": "block-6",
        "type": "items",
        "label": "Productos/Servicios",
        "order": 5,
        "visible": true,
        "required": true,
        "alignment": "left",
        "fontSize": "sm",
        "fontWeight": "normal",
        "paddingTop": 1,
        "paddingBottom": 1,
        "content": {
            "showImages": false,
            "showPrices": true,
            "showQuantity": true,
            "showSubtotal": true
        }
    },
    {
        "id": "block-7",
        "type": "separator",
        "label": "Separador",
        "order": 6,
        "visible": true,
        "required": false,
        "alignment": "center",
        "fontSize": "sm",
        "fontWeight": "normal",
        "paddingTop": 1,
        "paddingBottom": 1
    },
    {
        "id": "block-8",
        "type": "totals",
        "label": "Totales",
        "order": 7,
        "visible": true,
        "required": true,
        "alignment": "right",
        "fontSize": "md",
        "fontWeight": "bold",
        "paddingTop": 1,
        "paddingBottom": 2,
        "content": {
            "showSubtotal": true,
            "showTax": true,
            "showDiscount": true,
            "showTotal": true
        }
    },
    {
        "id": "block-9",
        "type": "payment_info",
        "label": "Información de Pago",
        "order": 8,
        "visible": true,
        "required": false,
        "alignment": "left",
        "fontSize": "sm",
        "fontWeight": "normal",
        "paddingTop": 1,
        "paddingBottom": 2
    },
    {
        "id": "block-10",
        "type": "separator",
        "label": "Separador",
        "order": 9,
        "visible": true,
        "required": false,
        "alignment": "center",
        "fontSize": "sm",
        "fontWeight": "normal",
        "paddingTop": 1,
        "paddingBottom": 1
    },
    {
        "id": "block-11",
        "type": "footer",
        "label": "Pie de Página",
        "order": 10,
        "visible": true,
        "required": false,
        "alignment": "center",
        "fontSize": "xs",
        "fontWeight": "normal",
        "paddingTop": 2,
        "paddingBottom": 2
    }
]'::jsonb);

-- ============================================================
-- COMENTARIOS
-- ============================================================
COMMENT ON TABLE print_templates IS 'Plantillas base de impresión para facturas, tickets y comandas';
COMMENT ON TABLE client_template_overrides IS 'Personalizaciones por cliente sin modificar plantillas base';
COMMENT ON TABLE template_history IS 'Historial de cambios para auditoría';
COMMENT ON COLUMN print_templates.blocks IS 'Estructura JSON con configuración de cada bloque';
COMMENT ON COLUMN client_template_overrides.overrides IS 'Solo diferencias respecto a la plantilla base';
