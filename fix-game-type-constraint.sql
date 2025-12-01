-- ============================================
-- CORREÇÃO: Constraint game_type
-- ============================================
-- Execute este SQL no Supabase SQL Editor antes do deploy

-- Remover a constraint antiga
ALTER TABLE public.bookings 
DROP CONSTRAINT IF EXISTS bookings_game_type_check;

-- Adicionar a nova constraint com todos os tipos de jogo
ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_game_type_check 
CHECK (game_type IN ('normal', 'pyramid', 'class', 'beach_volleyball', 'beach_tennis', 'footvolley', 'interdiction'));

-- Verificar
SELECT constraint_name, check_clause 
FROM information_schema.check_constraints 
WHERE constraint_name = 'bookings_game_type_check';
