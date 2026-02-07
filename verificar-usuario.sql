-- ============================================
-- VERIFICAR E DEBUGAR USUÁRIO
-- ============================================

-- 1. Ver todos os usuários no sistema
SELECT 
  'USUÁRIOS NO AUTH' as tabela,
  u.id,
  u.email,
  u.email_confirmed_at IS NOT NULL as email_confirmado,
  u.created_at
FROM auth.users u
ORDER BY u.created_at DESC;

-- 2. Ver todos os perfis
SELECT 
  'PERFIS NO SISTEMA' as tabela,
  p.id,
  p.cpf,
  p.first_name,
  p.last_name,
  p.roles,
  p.is_blocked
FROM public.profiles p
ORDER BY p.created_at DESC;

-- 3. Ver usuários + perfis juntos
SELECT 
  'USUÁRIOS COMPLETOS' as info,
  u.email,
  u.email_confirmed_at IS NOT NULL as confirmado,
  p.cpf,
  p.first_name || ' ' || p.last_name as nome,
  p.roles,
  p.is_blocked,
  CASE WHEN 'admin' = ANY(p.roles) THEN '✅ É Admin' ELSE '❌ Não é admin' END as status_admin
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- 4. Verificar especificamente seu CPF
SELECT 
  'SEU USUÁRIO (358.350.678-28)' as info,
  p.cpf,
  p.first_name,
  p.last_name,
  p.roles,
  p.is_blocked,
  u.email,
  u.email_confirmed_at IS NOT NULL as email_confirmado
FROM public.profiles p
LEFT JOIN auth.users u ON u.id = p.id
WHERE p.cpf = '358.350.678-28';

-- 5. Verificar email esperado
SELECT 
  'VERIFICAR EMAIL' as info,
  CASE 
    WHEN EXISTS (SELECT 1 FROM auth.users WHERE email = 'cpf35835067828@elitetenis.com.br') 
    THEN '✅ Email existe: cpf35835067828@elitetenis.com.br'
    ELSE '❌ Email NÃO existe'
  END as resultado;
