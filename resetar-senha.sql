-- ============================================
-- RESETAR SENHA DIRETAMENTE VIA SQL
-- Execute no SQL Editor do Supabase
-- ============================================

-- Forçar nova senha para o admin
UPDATE auth.users 
SET encrypted_password = crypt('elite123', gen_salt('bf', 10))
WHERE email = 'cpf35835067828@elitetenis.com.br';

-- Verificar que o update funcionou
SELECT 
    id,
    email,
    encrypted_password IS NOT NULL as tem_senha,
    email_confirmed_at IS NOT NULL as confirmado,
    updated_at
FROM auth.users 
WHERE email = 'cpf35835067828@elitetenis.com.br';

-- ============================================
-- RESULTADO ESPERADO:
-- - tem_senha = true
-- - confirmado = true
-- - updated_at deve mostrar data/hora atual
--
-- DEPOIS, TENTE LOGIN NO APP:
-- CPF: 358.350.678-28
-- Senha: elite123
-- ============================================
