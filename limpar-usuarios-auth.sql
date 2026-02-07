-- ============================================
-- Script para limpar usuários órfãos no Auth
-- ============================================
-- Este script remove usuários do sistema de autenticação (auth.users)
-- que não têm um perfil correspondente na tabela profiles.
-- Use este script quando tentar cadastrar um CPF que foi excluído 
-- anteriormente mas ainda existe no auth.

-- IMPORTANTE: Execute este script no SQL Editor do Supabase Dashboard
-- em: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- ============================================
-- PASSO 1: Ver quantos usuários órfãos existem
-- ============================================
SELECT 
    au.id,
    au.email,
    au.phone,
    au.raw_user_meta_data->>'cpf' as cpf,
    au.raw_user_meta_data->>'first_name' as first_name,
    au.raw_user_meta_data->>'last_name' as last_name,
    au.created_at
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
ORDER BY au.created_at DESC;

-- ============================================
-- PASSO 2: Deletar usuários órfãos (CUIDADO!)
-- ============================================
-- ATENÇÃO: Este comando deleta permanentemente usuários do auth.users
-- Certifique-se de ter revisado a lista acima antes de executar

-- DELETE FROM auth.users
-- WHERE id IN (
--     SELECT au.id
--     FROM auth.users au
--     LEFT JOIN public.profiles p ON au.id = p.id
--     WHERE p.id IS NULL
-- );

-- ============================================
-- ALTERNATIVA: Deletar um usuário específico por CPF
-- ============================================
-- Substitua '123.456.789-00' pelo CPF do usuário que deseja remover

-- DELETE FROM auth.users
-- WHERE raw_user_meta_data->>'cpf' = '123.456.789-00';

-- ============================================
-- NOTA: Após executar a deleção, você poderá 
-- cadastrar novamente o usuário pelo painel admin
-- ============================================
