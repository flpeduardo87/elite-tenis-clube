-- ============================================
-- FORÇAR LOGOUT DO VICTOR - MÉTODO DIRETO
-- ============================================

-- Execute TUDO de uma vez no Supabase SQL Editor

-- 1. Deletar todas as sessões do Victor (forçar logout)
DELETE FROM auth.sessions 
WHERE user_id IN (
    SELECT u.id 
    FROM auth.users u
    JOIN profiles p ON u.id = p.id
    WHERE p.cpf = '01018467971'
);

-- 2. Verificar se funcionou (deve retornar 0 sessões)
SELECT COUNT(*) as sessoes_restantes
FROM auth.sessions s
WHERE s.user_id IN (
    SELECT u.id 
    FROM auth.users u
    JOIN profiles p ON u.id = p.id
    WHERE p.cpf = '01018467971'
);

-- Se aparecer "0" = ✅ Victor foi deslogado com sucesso!

-- ============================================
-- OPÇÃO 2: Via Painel Supabase (Mais Fácil!)
-- ============================================

-- 1. Acesse: https://app.supabase.com/project/fgatsahxpeugqymcyjgw/auth/users
-- 2. Procure por "Victor Orlikoski" ou email: cpf01018467971@elitetenis.com.br
-- 3. Clique nos 3 pontinhos (⋮) ao lado do usuário
-- 4. Selecione "Sign out user"
-- 5. Pronto! Ele será deslogado imediatamente

-- ============================================
-- VERIFICAR SESSÕES ATIVAS
-- ============================================

-- Ver quantas sessões ativas existem para o Victor
SELECT COUNT(*) as sessoes_ativas
FROM auth.sessions s
JOIN auth.users u ON s.user_id = u.id
JOIN profiles p ON u.id = p.id
WHERE p.cpf = '01018467971';
