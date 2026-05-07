-- Tabla de notificaciones in-app por usuario
CREATE TABLE notificaciones (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id      UUID        NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tipo            TEXT        NOT NULL,
    titulo          TEXT        NOT NULL,
    mensaje         TEXT        NOT NULL,
    referencia_id   UUID,
    referencia_tipo TEXT,
    leida           BOOLEAN     NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para las queries más frecuentes
CREATE INDEX idx_notificaciones_user_leida    ON notificaciones (user_id, leida);
CREATE INDEX idx_notificaciones_empresa_fecha ON notificaciones (empresa_id, created_at DESC);

-- RLS: cada usuario solo accede a sus propias notificaciones, dentro de su empresa
ALTER TABLE notificaciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY notif_select ON notificaciones
    FOR SELECT USING (
        auth.uid() = user_id
        AND empresa_id = (SELECT empresa_id FROM profiles WHERE id = auth.uid())
    );

CREATE POLICY notif_update ON notificaciones
    FOR UPDATE USING (
        auth.uid() = user_id
        AND empresa_id = (SELECT empresa_id FROM profiles WHERE id = auth.uid())
    )
    WITH CHECK (
        auth.uid() = user_id
    );

CREATE POLICY notif_delete ON notificaciones
    FOR DELETE USING (auth.uid() = user_id);

-- Suscripción Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE notificaciones;

-- Función helper para insertar notificaciones desde triggers o servicios
CREATE OR REPLACE FUNCTION create_notification(
    p_empresa_id      UUID,
    p_user_id         UUID,
    p_tipo            TEXT,
    p_titulo          TEXT,
    p_mensaje         TEXT,
    p_referencia_id   UUID    DEFAULT NULL,
    p_referencia_tipo TEXT    DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO notificaciones (empresa_id, user_id, tipo, titulo, mensaje, referencia_id, referencia_tipo)
    VALUES (p_empresa_id, p_user_id, p_tipo, p_titulo, p_mensaje, p_referencia_id, p_referencia_tipo)
    RETURNING id INTO v_id;
    RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
