-- ============================================
-- DIAGNÓSTICO COMPLETO + RESET DE SENHA
-- ============================================

-- 1. Ver o que está no banco
SELECT 
  '1. USUÁRIO NO AUTH' as info,
  u.id,
  u.email,
  u.email_confirmed_at,
  u.encrypted_password IS NOT NULL as tem_senha,
  u.created_at
FROM auth.users u
WHERE u.email = 'cpf35835067828@elitetenis.com.br';

SELECT 
  '2. PERFIL' as info,
  p.id,
  p.cpf,
  p.first_name,
  p.last_name,
  p.roles,
  p.is_blocked
FROM public.profiles p
WHERE p.cpf = '358.350.678-28';

-- 3. RESETAR SENHA PARA elite123
UPDATE auth.users
SET encrypted_password = crypt('elite123', gen_salt('bf')),
    email_confirmed_at = NOW()
WHERE email = 'cpf35835067828@elitetenis.com.br';

-- 4. GARANTIR QUE É ADMIN
UPDATE public.profiles 
SET roles = ARRAY['member', 'admin']::text[],
    is_blocked = FALSE
WHERE cpf = '358.350.678-28';

-- 5. VERIFICAÇÃO FINAL
SELECT 
  '✅ PRONTO PARA LOGIN' as status,
  u.email,
  'Senha resetada para: elite123' as senha,
  u.email_confirmed_at IS NOT NULL as email_confirmado,
  p.cpf as cpf_login,
  p.first_name || ' ' || p.last_name as nome,
  p.roles,
  p.is_blocked,
  CASE 
    WHEN 'admin' = ANY(p.roles) THEN '✅ É ADMIN' 
    ELSE '❌ NÃO É ADMIN' 
  END as admin_check
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'cpf35835067828@elitetenis.com.br';

-- ============================================
-- DADOS PARA LOGIN:
-- CPF: 358.350.678-28 (ou 35835067828 sem formatação)
-- Senha: elite123
-- ============================================
