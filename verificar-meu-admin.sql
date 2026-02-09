-- ============================================
-- VERIFICAR E RESTAURAR ADMIN
-- ============================================

-- 1. VERIFICAR SITUAÇÃO ATUAL
SELECT 
  '📊 STATUS ATUAL' as info,
  u.email,
  u.id,
  p.cpf,
  p.first_name || ' ' || p.last_name as nome_completo,
  p.roles,
  p.is_blocked,
  CASE 
    WHEN 'admin' = ANY(p.roles) THEN '✅ É ADMIN' 
    ELSE '❌ NÃO É ADMIN'
  END as status_admin
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.cpf = '358.350.678-28' OR u.email LIKE '%35835067828%';

-- 2. RESTAURAR ADMIN (se necessário)
UPDATE public.profiles 
SET roles = ARRAY['member', 'admin']::text[],
    is_blocked = FALSE
WHERE cpf = '358.350.678-28';

-- 3. VERIFICAR NOVAMENTE
SELECT 
  '✅ APÓS ATUALIZAÇÃO' as info,
  u.email,
  p.cpf,
  p.first_name || ' ' || p.last_name as nome_completo,
  p.roles,
  p.is_blocked,
  CASE 
    WHEN 'admin' = ANY(p.roles) THEN '✅ É ADMIN!' 
    ELSE '❌ NÃO É ADMIN'
  END as confirmacao
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
WHERE p.cpf = '358.350.678-28';

-- ============================================
-- SE APARECER COMO ADMIN, FAÇA:
-- 1. Logout do sistema
-- 2. Login novamente com:
--    CPF: 358.350.678-28
--    Senha: elite123 (ou sua senha atual)
-- ============================================
