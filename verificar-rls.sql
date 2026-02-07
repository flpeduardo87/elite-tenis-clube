-- ============================================
-- VERIFICAR RLS E POLICIES
-- ============================================

-- 1. Ver se RLS está ativado
SELECT 
  schemaname, 
  tablename, 
  rowsecurity as rls_habilitado
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'bookings');

-- 2. Ver todas as policies em profiles
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'profiles';

-- 3. Ver todas as policies em bookings
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'bookings';

-- 4. Testar se o usuário consegue ver dados
SELECT COUNT(*) as total_profiles FROM public.profiles;
SELECT COUNT(*) as total_bookings FROM public.bookings;

-- 5. Ver dados do perfil
SELECT 
  id,
  cpf,
  first_name,
  last_name,
  roles,
  is_blocked
FROM public.profiles
LIMIT 5;
