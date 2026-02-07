-- ============================================
-- CRIAR ADMIN - VERSÃO SIMPLES
-- ============================================

-- Passo 1: Limpar usuário anterior
DELETE FROM public.profiles WHERE cpf = '358.350.678-28';
DELETE FROM auth.users WHERE email = 'cpf35835067828@elitetenis.com.br';

-- Passo 2: Usar o painel do Supabase para criar usuário
-- OU use este método mais simples:

-- Verificar se já existe
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM auth.users WHERE email = 'cpf35835067828@elitetenis.com.br')
    THEN 'Usuário já existe - vá para o passo 3'
    ELSE 'Usuário não existe - crie pelo painel Authentication'
  END as status;

-- Passo 3: Promover usuário existente a admin
UPDATE public.profiles 
SET roles = ARRAY['member', 'admin']::text[],
    is_blocked = FALSE,
    first_name = 'Felipe',
    last_name = 'Prado'
WHERE cpf = '358.350.678-28';

-- Passo 4: Se o perfil não existe, crie manualmente
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
    is_blocked = FALSE;

-- Verificar resultado
SELECT 
  '✅ VERIFICAÇÃO' as status,
  u.email,
  u.email_confirmed_at IS NOT NULL as confirmado,
  p.cpf,
  p.first_name || ' ' || p.last_name as nome,
  p.roles,
  CASE WHEN 'admin' = ANY(p.roles) THEN '✅ É ADMIN' ELSE '❌ NÃO É ADMIN' END as admin_check
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'cpf35835067828@elitetenis.com.br';
