-- ============================================
-- ADICIONAR DADOS DE EXEMPLO
-- ============================================

-- 1. Adicionar alguns usuários de exemplo (se não tiverem)
INSERT INTO public.profiles (id, cpf, first_name, last_name, roles, is_blocked)
VALUES 
  (gen_random_uuid(), '111.111.111-11', 'João', 'Silva', ARRAY['member']::text[], FALSE),
  (gen_random_uuid(), '222.222.222-22', 'Maria', 'Santos', ARRAY['member']::text[], FALSE),
  (gen_random_uuid(), '333.333.333-33', 'Pedro', 'Oliveira', ARRAY['member']::text[], FALSE)
ON CONFLICT (cpf) DO NOTHING;

-- 2. Adicionar uma reserva de exemplo para hoje
INSERT INTO public.bookings (court_id, date, time_slot_start, time_slot_end, member_id, opponent_id, game_type, status, booked_by_id)
VALUES (
  1,
  CURRENT_DATE,
  '10:00',
  '11:00',
  '358.350.678-28',
  '',
  'normal',
  'active',
  (SELECT id FROM auth.users WHERE email = 'cpf35835067828@elitetenis.com.br')
)
ON CONFLICT DO NOTHING;

-- 3. Verificar dados
SELECT 'Usuários total:' as info, COUNT(*) as total FROM public.profiles
UNION ALL
SELECT 'Reservas total:' as info, COUNT(*) as total FROM public.bookings;

-- ============================================
-- Resultado esperado: 
-- - Usuários total: 4+ (vous + 3 exemplos)
-- - Reservas total: 1+
-- ============================================
