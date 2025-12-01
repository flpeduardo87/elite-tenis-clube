-- ============================================
-- SCRIPT PARA CRIAR ADMIN MASTER
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- IMPORTANTE: Este script usa a extensão pgcrypto para gerar hash de senha
-- A senha será: elite123

-- 1. Habilitar extensão para hash de senha (se ainda não estiver)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Inserir usuário na tabela auth.users
-- ATENÇÃO: Substitua 'SEU_NOME' e 'SEU_SOBRENOME' pelos valores desejados
DO $$
DECLARE
    new_user_id UUID;
    cpf_value VARCHAR := '010.184.679-71';
    cpf_numbers VARCHAR := '01018467971';
    email_value VARCHAR := 'cpf01018467971@elitetenis.com.br';
    first_name_value VARCHAR := 'Admin';  -- ALTERE AQUI
    last_name_value VARCHAR := 'Master';   -- ALTERE AQUI
    password_value VARCHAR := 'elite123';
BEGIN
    -- Verificar se já existe
    IF EXISTS (SELECT 1 FROM auth.users WHERE email = email_value) THEN
        RAISE NOTICE 'Usuário com email % já existe. Pulando criação.', email_value;
        RETURN;
    END IF;

    -- Gerar UUID para o novo usuário
    new_user_id := gen_random_uuid();

    -- Inserir na tabela auth.users
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        recovery_token,
        email_change_token_new,
        email_change_token_current
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        new_user_id,
        'authenticated',
        'authenticated',
        email_value,
        crypt(password_value, gen_salt('bf')),
        NOW(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        jsonb_build_object(
            'cpf', cpf_value,
            'first_name', first_name_value,
            'last_name', last_name_value
        ),
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
    );

    -- Aguardar trigger criar o perfil ou criar manualmente se não existir
    PERFORM pg_sleep(0.5);
    
    -- Verificar se o perfil foi criado pelo trigger
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = new_user_id) THEN
        -- Inserir perfil manualmente
        INSERT INTO public.profiles (
            id,
            cpf,
            first_name,
            last_name,
            roles,
            is_blocked,
            created_at,
            updated_at
        ) VALUES (
            new_user_id,
            cpf_value,
            first_name_value,
            last_name_value,
            ARRAY['member', 'admin']::TEXT[],
            FALSE,
            NOW(),
            NOW()
        );
    ELSE
        -- Apenas promover a admin se já existe
        UPDATE public.profiles 
        SET roles = ARRAY['member', 'admin']::TEXT[]
        WHERE id = new_user_id;
    END IF;

    RAISE NOTICE 'Usuário admin criado com sucesso!';
    RAISE NOTICE 'Email: %', email_value;
    RAISE NOTICE 'Senha: %', password_value;
    RAISE NOTICE 'CPF para login: %', cpf_value;
END $$;

-- 3. Verificar criação
SELECT 
    u.id,
    u.email,
    u.email_confirmed_at,
    u.created_at,
    p.cpf,
    p.first_name,
    p.last_name,
    p.roles
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'cpf01018467971@elitetenis.com.br';

-- ============================================
-- RESULTADO ESPERADO:
-- - 1 linha mostrando o usuário com email confirmado
-- - roles contendo ['member', 'admin']
-- ============================================

-- Para fazer login no app:
-- CPF: 010.184.679-71
-- Senha: elite123
