-- ============================================
-- DIAGNÓSTICO COMPLETO - SEU CPF
-- Execute no SQL Editor do Supabase
-- ============================================

-- 1. Verificar se o usuário auth existe
SELECT 
    id,
    email,
    encrypted_password IS NOT NULL as tem_senha,
    email_confirmed_at,
    confirmed_at,
    created_at,
    raw_user_meta_data
FROM auth.users 
WHERE email = 'cpf35835067828@elitetenis.com.br';

-- 2. Verificar se o perfil existe
SELECT 
    id,
    cpf,
    first_name,
    last_name,
    roles,
    is_blocked
FROM public.profiles 
WHERE cpf = '358.350.678-28';

-- 3. Se o resultado acima mostrar que:
--    - auth.users existe MAS email_confirmed_at é NULL → execute:
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'cpf35835067828@elitetenis.com.br'
AND email_confirmed_at IS NULL;

-- 4. Se profiles não tem role admin → execute:
UPDATE public.profiles 
SET roles = ARRAY['member', 'admin']::TEXT[]
WHERE cpf = '358.350.678-28'
AND NOT ('admin' = ANY(roles));

-- 5. Se profiles NÃO existe mas auth.users existe → crie manualmente:
-- (Pegue o ID da query 1 e substitua abaixo)
/*
INSERT INTO public.profiles (id, cpf, first_name, last_name, roles, is_blocked)
VALUES ('COLE_O_ID_AQUI', '358.350.678-28', 'Admin', 'Master', ARRAY['member','admin'], FALSE)
ON CONFLICT (cpf) DO UPDATE SET id = EXCLUDED.id, roles = EXCLUDED.roles;
*/

-- 6. RESETAR SENHA (caso o hash esteja incorreto)
-- Copie o ID do usuário da query 1 e use no painel:
-- Authentication > Users > clique no usuário > Reset Password
-- Defina nova senha: elite123

-- 7. Verificação final
SELECT 
    u.id,
    u.email,
    u.email_confirmed_at IS NOT NULL as email_confirmado,
    u.confirmed_at IS NOT NULL as conta_confirmada,
    p.cpf,
    p.roles,
    p.is_blocked
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'cpf35835067828@elitetenis.com.br';

-- ============================================
-- RESULTADO ESPERADO na query 7:
-- email_confirmado = true
-- conta_confirmada = true
-- roles = {member,admin}
-- is_blocked = false
--
-- Se tudo OK e ainda não logar:
-- - Vá ao painel Authentication > Users
-- - Clique no usuário cpf35835067828@elitetenis.com.br
-- - Clique "Reset Password"
-- - Digite: elite123
-- - Tente login novamente
-- ============================================
