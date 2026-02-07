-- ============================================
-- ADICIONAR POLÍTICA DE DELETE PARA PROFILES
-- ============================================

-- Admins podem deletar perfis
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
CREATE POLICY "Admins can delete profiles"
    ON public.profiles FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND 'admin' = ANY(roles)
        )
    );

-- ============================================
-- RENOMEAR USUÁRIO SISTEMA PARA ADMIN MASTER
-- ============================================

-- Atualizar nome do admin principal
UPDATE public.profiles 
SET 
    first_name = 'Admin',
    last_name = 'Master'
WHERE cpf = '358.350.678-28';
