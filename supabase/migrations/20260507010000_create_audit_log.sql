-- Tabla de trazabilidad: registra INSERT/UPDATE/DELETE en tablas de negocio
CREATE TABLE IF NOT EXISTS audit_log (
    id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    empresa_id    UUID        REFERENCES empresas(id) ON DELETE CASCADE,
    tabla         TEXT        NOT NULL,
    registro_id   TEXT        NOT NULL,
    accion        TEXT        NOT NULL CHECK (accion IN ('INSERT', 'UPDATE', 'DELETE')),
    user_id       UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
    datos_antes   JSONB,
    datos_despues JSONB,
    created_at    TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Índices para las queries más comunes
CREATE INDEX idx_audit_log_empresa_fecha  ON audit_log(empresa_id, created_at DESC);
CREATE INDEX idx_audit_log_tabla_registro ON audit_log(tabla, registro_id);
CREATE INDEX idx_audit_log_user_fecha     ON audit_log(user_id, created_at DESC);

-- RLS: solo admin/director de la misma empresa puede leer
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_log_admin_select" ON audit_log
    FOR SELECT USING (
        empresa_id = auth_empresa_id()
        AND EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role IN ('admin', 'director')
        )
    );

-- Función de trigger genérica para todas las tablas de negocio
CREATE OR REPLACE FUNCTION fn_audit_log()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_empresa_id  UUID;
    v_registro_id TEXT;
BEGIN
    IF TG_OP = 'DELETE' THEN
        v_empresa_id  := OLD.empresa_id;
        v_registro_id := OLD.id::TEXT;
    ELSE
        v_empresa_id  := NEW.empresa_id;
        v_registro_id := NEW.id::TEXT;
    END IF;

    INSERT INTO audit_log (
        empresa_id, tabla, registro_id, accion, user_id,
        datos_antes, datos_despues
    ) VALUES (
        v_empresa_id,
        TG_TABLE_NAME,
        v_registro_id,
        TG_OP,
        auth.uid(),
        CASE TG_OP WHEN 'INSERT' THEN NULL ELSE to_jsonb(OLD) END,
        CASE TG_OP WHEN 'DELETE' THEN NULL ELSE to_jsonb(NEW) END
    );

    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Aplicar trigger a las tablas de negocio
CREATE TRIGGER audit_ordenes
    AFTER INSERT OR UPDATE OR DELETE ON ordenes
    FOR EACH ROW EXECUTE FUNCTION fn_audit_log();

CREATE TRIGGER audit_conductores
    AFTER INSERT OR UPDATE OR DELETE ON conductores
    FOR EACH ROW EXECUTE FUNCTION fn_audit_log();

CREATE TRIGGER audit_vehiculos
    AFTER INSERT OR UPDATE OR DELETE ON vehiculos
    FOR EACH ROW EXECUTE FUNCTION fn_audit_log();

CREATE TRIGGER audit_rutas_viajes
    AFTER INSERT OR UPDATE OR DELETE ON rutas_viajes
    FOR EACH ROW EXECUTE FUNCTION fn_audit_log();

CREATE TRIGGER audit_mantenimientos
    AFTER INSERT OR UPDATE OR DELETE ON mantenimientos_vehiculos
    FOR EACH ROW EXECUTE FUNCTION fn_audit_log();

CREATE TRIGGER audit_multas
    AFTER INSERT OR UPDATE OR DELETE ON multas_conductores
    FOR EACH ROW EXECUTE FUNCTION fn_audit_log();

CREATE TRIGGER audit_seguros
    AFTER INSERT OR UPDATE OR DELETE ON seguros_vehiculos
    FOR EACH ROW EXECUTE FUNCTION fn_audit_log();

CREATE TRIGGER audit_impuestos
    AFTER INSERT OR UPDATE OR DELETE ON impuestos_vehiculares
    FOR EACH ROW EXECUTE FUNCTION fn_audit_log();

CREATE TRIGGER audit_egresos
    AFTER INSERT OR UPDATE OR DELETE ON egresos_varios
    FOR EACH ROW EXECUTE FUNCTION fn_audit_log();
