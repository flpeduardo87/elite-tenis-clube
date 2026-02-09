-- ============================================
-- REMOVER PERMISSÕES DE ADMIN DO VICTOR
-- ============================================

-- 1. VERIFICAR STATUS ATUAL DO VICTOR
SELECT 
    p.cpf,
    p.first_name || ' ' || p.last_name as nome,
    p.roles,
    p.is_blocked,
    CASE 
        WHEN 'admin' = ANY(p.roles) THEN '⚠️ TEM ADMIN' 
        WHEN 'teacher' = ANY(p.roles) THEN '⚠️ TEM PROFESSOR'
        ELSE '✅ APENAS SÓCIO'
    END as status_atual
FROM profiles p
WHERE p.cpf = '01018467971';

-- 2. REMOVER ADMIN E PROFESSOR (deixar apenas member)
UPDATE profiles 
SET roles = ARRAY['member']::text[]
WHERE cpf = '01018467971';

-- 3. VERIFICAR SE CORRIGIU
SELECT 
    p.cpf,
    p.first_name || ' ' || p.last_name as nome,
    p.roles,
    p.is_blocked,
    CASE 
        WHEN 'admin' = ANY(p.roles) THEN '⚠️ AINDA TEM ADMIN' 
        WHEN 'teacher' = ANY(p.roles) THEN '⚠️ AINDA TEM PROFESSOR'
        ELSE '✅ CORRIGIDO - APENAS SÓCIO'
    END as status_final
FROM profiles p
WHERE p.cpf = '01018467971';

-- ============================================
-- DEPOIS: Victor precisa fazer LOGOUT e LOGIN
-- para que as mudanças tenham efeito!
-- ============================================

-- 4. VERIFICAR TODOS OS ADMINS ATUAIS
SELECT 
    p.cpf,
    p.first_name || ' ' || p.last_name as nome,
    p.roles
FROM profiles p
WHERE 'admin' = ANY(p.roles)
ORDER BY p.first_name;
