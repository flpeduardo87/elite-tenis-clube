-- ============================================
-- CORRIGIR TRIGGER DE CRIAÇÃO DE PERFIL
-- ============================================

-- Atualizar a função para tratar valores nulos
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, cpf, first_name, last_name, roles, is_blocked)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'cpf', '00000000000'),
        COALESCE(NEW.raw_user_meta_data->>'first_name', 'Novo'),
        COALESCE(NEW.raw_user_meta_data->>'last_name', 'Usuario'),
        ARRAY['member']::TEXT[],
        FALSE
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        cpf = COALESCE(EXCLUDED.cpf, profiles.cpf),
        first_name = COALESCE(EXCLUDED.first_name, profiles.first_name),
        last_name = COALESCE(EXCLUDED.last_name, profiles.last_name);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- CORRIGIR USUÁRIOS EXISTENTES COM NOMES VAZIOS
-- ============================================

-- Ver usuários com problemas
SELECT 
    p.id,
    p.cpf,
    p.first_name,
    p.last_name,
    u.email,
    u.raw_user_meta_data
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.first_name IS NULL 
   OR p.last_name IS NULL 
   OR p.first_name = ''
   OR p.last_name = '';

-- Se encontrou usuários com problemas, pedir para corrigir manualmente:
-- UPDATE public.profiles 
-- SET first_name = 'Nome', last_name = 'Sobrenome'
-- WHERE cpf = 'CPF_DO_USUARIO';

-- ============================================
-- DEPOIS: Fazer logout e login novamente
-- ============================================
