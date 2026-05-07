-- =====================================================
-- Triggers de generación automática de notificaciones
-- =====================================================
-- Cubre 4 eventos:
--   1. orden_nueva      → INSERT en ordenes
--   2. orden_estado     → UPDATE de estado en ordenes
--   3. seguro_venc      → estado_poliza cambia a por_vencer/vencida
--   4. multa_nueva      → INSERT en multas_conductores
-- =====================================================

-- ─────────────────────────────────────────────────────
-- HELPER: notifica a todos los usuarios de una empresa
-- con los roles indicados
-- ─────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION notify_empresa_roles(
    p_empresa_id      UUID,
    p_roles           TEXT[],
    p_tipo            TEXT,
    p_titulo          TEXT,
    p_mensaje         TEXT,
    p_referencia_id   UUID    DEFAULT NULL,
    p_referencia_tipo TEXT    DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    INSERT INTO notificaciones
        (empresa_id, user_id, tipo, titulo, mensaje, referencia_id, referencia_tipo)
    SELECT
        p_empresa_id,
        p.id,
        p_tipo,
        p_titulo,
        p_mensaje,
        p_referencia_id,
        p_referencia_tipo
    FROM profiles p
    WHERE p.empresa_id = p_empresa_id
      AND p.role = ANY(p_roles);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ─────────────────────────────────────────────────────
-- TRIGGER 1: Nueva orden de transporte
-- Destinatarios: admin, director, coordinador
-- ─────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION trigger_notif_orden_nueva()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM notify_empresa_roles(
        NEW.empresa_id,
        ARRAY['admin', 'director', 'coordinador'],
        'orden_nueva',
        'Nueva orden: ' || NEW.numero_orden,
        'Se creó una nueva orden de transporte.',
        NEW.id,
        'ordenes'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER notif_orden_nueva
    AFTER INSERT ON ordenes
    FOR EACH ROW
    EXECUTE FUNCTION trigger_notif_orden_nueva();


-- ─────────────────────────────────────────────────────
-- TRIGGER 2: Cambio de estado de una orden
-- Destinatarios: admin, director, coordinador
-- Solo dispara cuando el campo `estado` cambia
-- ─────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION trigger_notif_orden_estado()
RETURNS TRIGGER AS $$
DECLARE
    v_label_nuevo TEXT;
    v_label_viejo TEXT;
BEGIN
    IF OLD.estado IS NOT DISTINCT FROM NEW.estado THEN
        RETURN NEW;
    END IF;

    v_label_nuevo := CASE NEW.estado
        WHEN 'pendiente' THEN 'Pendiente'
        WHEN 'transito'  THEN 'En tránsito'
        WHEN 'entregado' THEN 'Entregado'
        ELSE NEW.estado
    END;

    v_label_viejo := CASE OLD.estado
        WHEN 'pendiente' THEN 'pendiente'
        WHEN 'transito'  THEN 'en tránsito'
        WHEN 'entregado' THEN 'entregado'
        ELSE OLD.estado
    END;

    PERFORM notify_empresa_roles(
        NEW.empresa_id,
        ARRAY['admin', 'director', 'coordinador'],
        'orden_estado',
        'Orden ' || NEW.numero_orden || ': ' || v_label_nuevo,
        'Estado cambiado de "' || v_label_viejo || '" a "' || lower(v_label_nuevo) || '".',
        NEW.id,
        'ordenes'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER notif_orden_estado
    AFTER UPDATE OF estado ON ordenes
    FOR EACH ROW
    EXECUTE FUNCTION trigger_notif_orden_estado();


-- ─────────────────────────────────────────────────────
-- TRIGGER 3: Seguro por vencer o vencido
-- Destinatarios: admin, director, supervisor
-- Solo dispara cuando estado_poliza cambia a por_vencer o vencida
-- ─────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION trigger_notif_seguro_vencimiento()
RETURNS TRIGGER AS $$
DECLARE
    v_titulo  TEXT;
    v_mensaje TEXT;
BEGIN
    IF OLD.estado_poliza IS NOT DISTINCT FROM NEW.estado_poliza THEN
        RETURN NEW;
    END IF;

    IF NEW.estado_poliza = 'por_vencer' THEN
        v_titulo  := 'Seguro por vencer: ' || NEW.placa_vehiculo;
        v_mensaje := 'La póliza ' || NEW.poliza_seguro
                     || ' vence el ' || to_char(NEW.fecha_vencimiento, 'DD/MM/YYYY') || '.';

    ELSIF NEW.estado_poliza = 'vencida' THEN
        v_titulo  := 'Seguro vencido: ' || NEW.placa_vehiculo;
        v_mensaje := 'La póliza ' || NEW.poliza_seguro
                     || ' venció el ' || to_char(NEW.fecha_vencimiento, 'DD/MM/YYYY') || '.';
    ELSE
        RETURN NEW;
    END IF;

    PERFORM notify_empresa_roles(
        NEW.empresa_id,
        ARRAY['admin', 'director', 'supervisor'],
        'seguro_vencimiento',
        v_titulo,
        v_mensaje,
        NEW.id,
        'seguros'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER notif_seguro_vencimiento
    AFTER INSERT OR UPDATE OF estado_poliza ON seguros_vehiculos
    FOR EACH ROW
    EXECUTE FUNCTION trigger_notif_seguro_vencimiento();


-- ─────────────────────────────────────────────────────
-- TRIGGER 4: Nueva multa registrada
-- Destinatarios: admin, director, recursos_humanos, administrativo
-- Incluye nombre del conductor si existe en la tabla conductores
-- ─────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION trigger_notif_multa_nueva()
RETURNS TRIGGER AS $$
DECLARE
    v_nombre_conductor TEXT;
    v_mensaje          TEXT;
BEGIN
    SELECT nombre_conductor INTO v_nombre_conductor
    FROM conductores
    WHERE documento_identidad = NEW.conductor
      AND empresa_id           = NEW.empresa_id
    LIMIT 1;

    v_mensaje := 'Infracción: "' || NEW.infraccion || '"';

    IF v_nombre_conductor IS NOT NULL THEN
        v_mensaje := v_mensaje || ' — conductor: ' || v_nombre_conductor;
    END IF;

    v_mensaje := v_mensaje || '. Valor: $' || to_char(NEW.importe_multa, 'FM999,999,999.00') || '.';

    PERFORM notify_empresa_roles(
        NEW.empresa_id,
        ARRAY['admin', 'director', 'recursos_humanos', 'administrativo'],
        'multa_nueva',
        'Nueva multa: ' || NEW.placa_vehiculo,
        v_mensaje,
        NEW.id,
        'multas'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER notif_multa_nueva
    AFTER INSERT ON multas_conductores
    FOR EACH ROW
    EXECUTE FUNCTION trigger_notif_multa_nueva();
