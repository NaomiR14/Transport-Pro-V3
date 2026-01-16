-- Actualizar función handle_new_user para manejar nombre y apellido correctamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_nombre TEXT;
    user_apellido TEXT;
    full_name TEXT;
BEGIN
    -- Obtener nombre del metadata o del email
    user_nombre := COALESCE(
        NEW.raw_user_meta_data->>'nombre',
        SPLIT_PART(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), ' ', 1)
    );
    
    -- Obtener apellido del metadata o del email
    user_apellido := COALESCE(
        NEW.raw_user_meta_data->>'apellido',
        SPLIT_PART(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), ' ', 2)
    );
    
    -- Si apellido está vacío, intentar extraer del email
    IF user_apellido = '' OR user_apellido IS NULL THEN
        user_apellido := SPLIT_PART(NEW.email, '@', 1);
    END IF;

    INSERT INTO public.profiles (id, nombre, apellido, role)
    VALUES (
        NEW.id,
        user_nombre,
        user_apellido,
        COALESCE(
            NEW.raw_user_meta_data->>'role',
            CASE 
                WHEN NEW.email ILIKE '%@transportpro.com' THEN 'admin'
                ELSE 'conductor'
            END
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentario explicativo
COMMENT ON FUNCTION public.handle_new_user() IS 
'Función que crea automáticamente un perfil cuando se registra un nuevo usuario.
Extrae nombre y apellido de raw_user_meta_data o del email si no están disponibles.';
