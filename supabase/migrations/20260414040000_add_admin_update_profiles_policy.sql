-- Política RLS: permitir que usuarios con role 'admin' puedan actualizar el rol de otros usuarios
CREATE POLICY "Admin can update any profile role" ON profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );
