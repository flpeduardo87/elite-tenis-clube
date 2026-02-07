-- ============================================
-- LIMPAR BANCO DE DADOS COMPLETO
-- Execute no Supabase SQL Editor
-- ============================================

-- ATENÇÃO: Isso vai apagar TODOS os dados!
-- Use apenas se quiser começar do zero

-- 1. Deletar todas as reservas
DELETE FROM public.bookings;

-- 2. Deletar todos os perfis
DELETE FROM public.profiles;

-- 3. Limpar usuários do auth (CUIDADO!)
-- Isso remove todos os usuários do sistema de autenticação
DO $$
DECLARE
  user_id_var UUID;
BEGIN
  FOR user_id_var IN SELECT id FROM auth.users LOOP
    DELETE FROM auth.sessions WHERE user_id = user_id_var;
    DELETE FROM auth.identities WHERE user_id = user_id_var;
    DELETE FROM auth.refresh_tokens WHERE user_id = user_id_var;
  END LOOP;
  
  DELETE FROM auth.users;
END $$;

-- 4. Resetar sequences (se existirem)
-- ALTER SEQUENCE IF EXISTS bookings_id_seq RESTART WITH 1;

-- ============================================
-- VERIFICAR SE LIMPOU TUDO
-- ============================================
SELECT 'Bookings restantes:' as tabela, COUNT(*) as total FROM public.bookings
UNION ALL
SELECT 'Profiles restantes:' as tabela, COUNT(*) as total FROM public.profiles
UNION ALL
SELECT 'Auth users restantes:' as tabela, COUNT(*) as total FROM auth.users;

-- Resultado esperado: 0 em todas as tabelas
