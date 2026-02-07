-- ============================================
-- FORÇAR CRIAÇÃO/RESET DO ADMIN
-- ============================================

-- Este script vai:
-- 1. Deletar qualquer usuário com CPF 358.350.678-28
-- 2. Criar do zero com senha garantida
-- 3. Confirmar email
-- 4. Dar permissões de admin

DO $$
DECLARE
  user_id UUID;
  cpf_value VARCHAR := '358.350.678-28';
  cpf_numbers VARCHAR := '35835067828';
  email_value VARCHAR := 'cpf35835067828@elitetenis.com.br';
  password_value VARCHAR := 'elite123';
BEGIN
  -- 1. LIMPAR QUALQUER REGISTRO ANTERIOR
  DELETE FROM public.profiles WHERE cpf = cpf_value;
  DELETE FROM auth.users WHERE email = email_value;
  
  RAISE NOTICE '🗑️ Limpou registros anteriores';
  
  -- 2. CRIAR NOVO UUID
  user_id := gen_random_uuid();
  
  -- 3. DESABILITAR TRIGGER TEMPORARIAMENTE
  ALTER TABLE auth.users DISABLE TRIGGER on_auth_user_created;
  
  -- 4. CRIAR USUÁRIO NO AUTH
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change_token_current,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    user_id,
    'authenticated',
    'authenticated',
    email_value,
    crypt(password_value, gen_salt('bf')),
    NOW(),
    '',
    '',
    '',
    '',
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object(
      'cpf', cpf_value,
      'first_name', 'Felipe',
      'last_name', 'Prado'
    ),
    NOW(),
    NOW()
  );
  
  -- 5. REABILITAR TRIGGER
  ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;
  
  RAISE NOTICE '✅ Usuário criado no auth';
  
  -- 6. CRIAR PERFIL COM ADMIN
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
    user_id,
    cpf_value,
    'Felipe',
    'Prado',
    ARRAY['member', 'admin']::text[],
    FALSE,
    NOW(),
    NOW()
  );
  
  RAISE NOTICE '✅ Perfil criado com admin';
  RAISE NOTICE '';
  RAISE NOTICE '====================================';
  RAISE NOTICE '✅ ADMIN CRIADO COM SUCESSO!';
  RAISE NOTICE '====================================';
  RAISE NOTICE 'CPF para login: %', cpf_value;
  RAISE NOTICE 'Senha: %', password_value;
  RAISE NOTICE 'Email (interno): %', email_value;
  RAISE NOTICE '';
END $$;

-- VERIFICAR RESULTADO
SELECT 
  '✅ VERIFICAÇÃO FINAL' as status,
  u.email,
  u.email_confirmed_at IS NOT NULL as email_confirmado,
  p.cpf,
  p.first_name || ' ' || p.last_name as nome,
  p.roles,
  p.is_blocked,
  CASE 
    WHEN 'admin' = ANY(p.roles) THEN '✅ É ADMIN' 
    ELSE '❌ NÃO É ADMIN' 
  END as admin_status
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
WHERE p.cpf = '358.350.678-28';

-- ============================================
-- DADOS PARA LOGIN:
-- CPF: 358.350.678-28
-- Senha: elite123
-- ============================================
