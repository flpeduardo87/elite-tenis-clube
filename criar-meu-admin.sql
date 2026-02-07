-- ============================================
-- CRIAR SEU USUÁRIO ADMIN
-- ============================================

-- INSTRUÇÕES:
-- 1. ALTERE O CPF na linha 15 (coloque o SEU CPF)
-- 2. Copie TODO este arquivo
-- 3. Cole no Supabase SQL Editor
-- 4. Clique em "Run"

DO $$
DECLARE
  user_id UUID;
  
  -- ⚠️ ALTERE AQUI COM SEU CPF (formato: 000.000.000-00)
  cpf_value VARCHAR := '358.350.678-28';  -- CPF do Admin
  
  cpf_numbers VARCHAR;
  email_value VARCHAR;
  password_value VARCHAR := 'elite123';  -- Senha inicial (troque depois no app)
  first_name_value VARCHAR := 'Admin';
  last_name_value VARCHAR := 'Master';
  user_exists BOOLEAN;
  profile_exists BOOLEAN;
BEGIN
  -- Remover formatação do CPF
  cpf_numbers := regexp_replace(cpf_value, '\D', '', 'g');
  email_value := 'cpf' || cpf_numbers || '@elitetenis.com.br';
  
  -- Verificar se usuário já existe
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = email_value) INTO user_exists;
  
  IF user_exists THEN
    -- Pegar ID do usuário existente
    SELECT id INTO user_id FROM auth.users WHERE email = email_value;
    RAISE NOTICE 'ℹ️ Usuário já existe, atualizando para admin...';
    
    -- Verificar se perfil existe
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = user_id) INTO profile_exists;
    
    IF profile_exists THEN
      -- Atualizar perfil existente para admin
      UPDATE public.profiles 
      SET roles = ARRAY['member','admin']::text[], 
          is_blocked = FALSE
      WHERE id = user_id;
      RAISE NOTICE '✅ Perfil atualizado para admin!';
    ELSE
      -- Criar perfil que está faltando
      INSERT INTO public.profiles (id, cpf, first_name, last_name, roles, is_blocked)
      VALUES (user_id, cpf_value, first_name_value, last_name_value, ARRAY['member','admin']::text[], FALSE);
      RAISE NOTICE '✅ Perfil criado e promovido a admin!';
    END IF;
  ELSE
    -- Criar novo usuário
    user_id := gen_random_uuid();
    
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
      user_id,
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

    -- Criar perfil com permissões de admin
    INSERT INTO public.profiles (id, cpf, first_name, last_name, roles, is_blocked)
    VALUES (user_id, cpf_value, first_name_value, last_name_value, ARRAY['member','admin']::text[], FALSE)
    ON CONFLICT (id) DO UPDATE SET roles = ARRAY['member','admin']::text[], is_blocked = FALSE;
    
    RAISE NOTICE '✅ Admin criado com sucesso!';
  END IF;

  RAISE NOTICE '📧 Email: %', email_value;
  RAISE NOTICE '🆔 CPF para login: %', cpf_value;
  RAISE NOTICE '🔑 Senha: %', password_value;
END $$;

-- Verificar se criou corretamente
SELECT 
  '✅ Admin criado!' as status,
  p.cpf as cpf_login,
  p.first_name || ' ' || p.last_name as nome,
  p.roles as permissoes,
  CASE WHEN 'admin' = ANY(p.roles) THEN '✅ É Admin' ELSE '❌ NÃO é admin' END as admin_check
FROM public.profiles p
WHERE p.cpf = '358.350.678-28';

-- ============================================
-- PARA FAZER LOGIN NO APP:
-- CPF: (o que você colocou acima)
-- Senha: elite123
-- ============================================
