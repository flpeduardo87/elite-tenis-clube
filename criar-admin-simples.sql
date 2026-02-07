-- ============================================
-- CRIAR ADMIN COM SEU CPF
-- Instruções: 
-- 1) Substitua SEU_CPF_AQUI pelo seu CPF (formato 000.000.000-00)
-- 2) Cole TODO este arquivo no SQL Editor do Supabase
-- 3) Execute (Run)
-- ============================================

-- PASSO 1: Limpar qualquer resíduo anterior
DELETE FROM auth.users WHERE email LIKE 'cpf%@elitetenis.com.br';
DELETE FROM public.profiles WHERE cpf IN ('010.184.679-71', 'SEU_CPF_AQUI');

-- PASSO 2: Atualizar a função do trigger para ser mais robusta
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  cpf_raw text := COALESCE(NEW.raw_user_meta_data->>'cpf', '');
  fn text := COALESCE(NEW.raw_user_meta_data->>'first_name','Admin');
  ln text := COALESCE(NEW.raw_user_meta_data->>'last_name','Master');
  cpf_digits text;
  cpf_fmt text;
BEGIN
  -- Extrair dígitos do CPF do metadata ou do email
  IF cpf_raw = '' THEN
    cpf_digits := regexp_replace(NEW.email, '^cpf([0-9]{11})@.*$', '\1');
  ELSE
    cpf_digits := regexp_replace(cpf_raw, '\D', '', 'g');
  END IF;

  -- Se não conseguir 11 dígitos, não cria perfil (evita erro)
  IF cpf_digits IS NULL OR length(cpf_digits) <> 11 THEN
    RAISE NOTICE 'CPF inválido ou ausente para user %, pulando criação de perfil', NEW.id;
    RETURN NEW;
  END IF;

  -- Formatar XXX.XXX.XXX-YY
  cpf_fmt := substring(cpf_digits from 1 for 3)||'.'||
             substring(cpf_digits from 4 for 3)||'.'||
             substring(cpf_digits from 7 for 3)||'-'||
             substring(cpf_digits from 10 for 2);

  -- Inserir ou atualizar perfil
  INSERT INTO public.profiles (id, cpf, first_name, last_name, roles, is_blocked)
  VALUES (NEW.id, cpf_fmt, fn, ln, ARRAY['member']::text[], FALSE)
  ON CONFLICT (cpf) DO UPDATE
  SET id = EXCLUDED.id,
      first_name = COALESCE(NULLIF(EXCLUDED.first_name,''), public.profiles.first_name),
      last_name  = COALESCE(NULLIF(EXCLUDED.last_name,''), public.profiles.last_name);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASSO 3: Inserir admin manualmente (mais confiável que criar pelo painel)
DO $$
DECLARE
  new_user_id UUID;
  cpf_value VARCHAR := '358.350.678-28';  -- ALTERE AQUI! Ex: 123.456.789-00
  cpf_numbers VARCHAR;
  email_value VARCHAR;
  password_value VARCHAR := 'elite123';
  first_name_value VARCHAR := 'Admin';
  last_name_value VARCHAR := 'Master';
BEGIN
  -- Remover formatação do CPF
  cpf_numbers := regexp_replace(cpf_value, '\D', '', 'g');
  email_value := 'cpf' || cpf_numbers || '@elitetenis.com.br';
  
  -- Gerar UUID
  new_user_id := gen_random_uuid();

  -- Criar usuário auth
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

  -- Aguardar trigger (simulado)
  PERFORM pg_sleep(0.3);

  -- Garantir que o perfil existe e promover a admin
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = new_user_id) THEN
    INSERT INTO public.profiles (id, cpf, first_name, last_name, roles, is_blocked)
    VALUES (new_user_id, cpf_value, first_name_value, last_name_value, ARRAY['member','admin']::text[], FALSE);
  ELSE
    UPDATE public.profiles SET roles = ARRAY['member','admin']::text[] WHERE id = new_user_id;
  END IF;

  RAISE NOTICE 'Admin criado com sucesso!';
  RAISE NOTICE 'Email: %', email_value;
  RAISE NOTICE 'CPF para login: %', cpf_value;
  RAISE NOTICE 'Senha: %', password_value;
END $$;

-- PASSO 4: Verificar resultado
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at IS NOT NULL as confirmado,
  p.cpf,
  p.first_name,
  p.last_name,
  p.roles,
  p.is_blocked
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email LIKE 'cpf%@elitetenis.com.br'
ORDER BY u.created_at DESC
LIMIT 5;

-- ============================================
-- RESULTADO ESPERADO:
-- - 1 linha com email confirmado, roles ['member','admin'], is_blocked = false
--
-- PARA LOGIN NO APP:
-- - CPF: (o que você colocou acima)
-- - Senha: elite123
-- ============================================
