-- ============================================
-- CRIAR ADMIN - FELIPE PRADO
-- ============================================

-- Passo 1: Limpar registros anteriores (se houver)
DELETE FROM public.profiles WHERE cpf = '358.350.678-28';
DELETE FROM auth.users WHERE email = 'cpf35835067828@elitetenis.com.br';

-- Passo 2: Aguarde e vá para o painel do Supabase
-- Authentication > Users > Add user > Create new user

-- Preencha:
-- Email: cpf35835067828@elitetenis.com.br
-- Password: elite123
-- ✅ MARQUE: Auto Confirm User

-- Passo 3: Depois de criar no painel, execute isto:
-- (Aguarde 5 segundos após criar o usuário no painel)

-- Promover para admin
UPDATE public.profiles 
SET roles = ARRAY['member', 'admin']::text[],
    is_blocked = FALSE,
    first_name = 'Felipe',
    last_name = 'Prado'
WHERE cpf = '358.350.678-28';

-- Se o perfil não foi criado automaticamente, crie manualmente:
INSERT INTO public.profiles (id, cpf, first_name, last_name, roles, is_blocked)
SELECT 
  u.id,
  '358.350.678-28',
  'Felipe',
  'Prado',
  ARRAY['member', 'admin']::text[],
  FALSE
FROM auth.users u
WHERE u.email = 'cpf35835067828@elitetenis.com.br'
ON CONFLICT (cpf) DO UPDATE 
SET roles = ARRAY['member', 'admin']::text[],
    is_blocked = FALSE,
    first_name = 'Felipe',
    last_name = 'Prado';

-- Verificar
SELECT 
  '✅ ADMIN CRIADO!' as status,
  u.email,
  p.cpf as cpf_login,
  p.first_name || ' ' || p.last_name as nome,
  p.roles,
  CASE WHEN 'admin' = ANY(p.roles) THEN '✅ É ADMIN' ELSE '❌ NÃO' END as admin_check
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
WHERE p.cpf = '358.350.678-28';

-- ============================================
-- DADOS PARA LOGIN:
-- CPF: 358.350.678-28
-- Senha: elite123
-- ============================================
