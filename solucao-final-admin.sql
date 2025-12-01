-- ============================================
-- ÚLTIMA SOLUÇÃO: RECRIAR PELO PAINEL
-- ============================================

-- PASSO 1: Deletar tudo (limpar)
DELETE FROM auth.users WHERE email = 'cpf35835067828@elitetenis.com.br';
DELETE FROM public.profiles WHERE cpf = '358.350.678-28';

-- PASSO 2: Verificar que está limpo
SELECT count(*) as usuarios FROM auth.users WHERE email = 'cpf35835067828@elitetenis.com.br';
SELECT count(*) as perfis FROM public.profiles WHERE cpf = '358.350.678-28';
-- Ambos devem retornar 0

-- ============================================
-- PASSO 3: CRIAR PELO PAINEL DO SUPABASE
-- ============================================
-- Vá em: Authentication > Users > Add user
--
-- Preencha:
--   Email: cpf35835067828@elitetenis.com.br
--   Password: elite123
--   Auto Confirm User: YES (marque essa opção!)
--   User Metadata (expanda e adicione JSON):
--   {
--     "cpf": "358.350.678-28",
--     "first_name": "Admin",
--     "last_name": "Master"
--   }
--
-- Clique em "Create user"
-- Aguarde 3-5 segundos
-- ============================================

-- PASSO 4: Promover a admin (rode após criar no painel)
UPDATE public.profiles 
SET roles = ARRAY['member', 'admin']::TEXT[]
WHERE cpf = '358.350.678-28';

-- PASSO 5: Verificar tudo
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
INNER JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'cpf35835067828@elitetenis.com.br';

-- ============================================
-- RESULTADO ESPERADO:
-- - confirmado = true
-- - roles = {member,admin}
-- - is_blocked = false
--
-- LOGIN NO APP:
-- CPF: 358.350.678-28
-- Senha: elite123
-- ============================================
