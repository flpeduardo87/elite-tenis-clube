-- ============================================
-- DIAGNÓSTICO COMPLETO DO ADMIN
-- ============================================

-- 1. Verificar usuário na auth.users
SELECT 
    id,
    email,
    encrypted_password IS NOT NULL as tem_senha,
    email_confirmed_at,
    confirmed_at,
    created_at,
    raw_user_meta_data
FROM auth.users 
WHERE email = 'cpf01018467971@elitetenis.com.br';

-- 2. Verificar perfil
SELECT 
    id,
    cpf,
    first_name,
    last_name,
    roles,
    is_blocked
FROM public.profiles 
WHERE cpf = '010.184.679-71';

-- 3. Se o usuário existir mas email não estiver confirmado, corrigir:
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'cpf01018467971@elitetenis.com.br'
AND email_confirmed_at IS NULL;

-- 4. Se não tiver roles de admin, corrigir:
UPDATE public.profiles 
SET roles = ARRAY['member', 'admin']::TEXT[]
WHERE cpf = '010.184.679-71'
AND NOT ('admin' = ANY(roles));

-- 5. Verificar resultado final
SELECT 
    u.id,
    u.email,
    u.email_confirmed_at IS NOT NULL as email_confirmado,
    p.cpf,
    p.roles,
    p.is_blocked
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'cpf01018467971@elitetenis.com.br';
