-- ============================================
-- INVESTIGAR PROBLEMAS REPORTADOS
-- ============================================

-- 1. VERIFICAR AGENDAMENTOS DO LUIZ
SELECT 
    b.id,
    b.date,
    b.time_slot_start,
    b.time_slot_end,
    b.court_id,
    b.game_type,
    b.status,
    b.created_at,
    p.first_name || ' ' || p.last_name as nome_usuario
FROM bookings b
JOIN profiles p ON b.member_id = p.cpf
WHERE p.first_name LIKE '%Luiz%' 
  AND b.status = 'active'
  AND b.date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY b.date, b.time_slot_start;

-- 2. VERIFICAR ROLES DO VICTOR
SELECT 
    p.cpf,
    p.first_name || ' ' || p.last_name as nome,
    p.roles,
    p.is_blocked,
    CASE 
        WHEN 'admin' = ANY(p.roles) THEN '⚠️ TEM ADMIN' 
        WHEN 'teacher' = ANY(p.roles) THEN '⚠️ TEM PROFESSOR'
        ELSE '✅ APENAS SÓCIO'
    END as status_roles
FROM profiles p
WHERE p.first_name LIKE '%Victor%'
   OR p.last_name LIKE '%Victor%';

-- 3. VERIFICAR TODOS OS ADMINS
SELECT 
    p.cpf,
    p.first_name || ' ' || p.last_name as nome,
    p.roles,
    p.is_blocked
FROM profiles p
WHERE 'admin' = ANY(p.roles)
   OR 'teacher' = ANY(p.roles)
ORDER BY p.first_name;

-- ============================================
-- CORREÇÕES (se necessário)
-- ============================================

-- Se LUIZ tem agendamentos demais e foram criados ANTES da regra:
-- Isso é normal. A regra só vale para NOVOS agendamentos.
-- Os agendamentos antigos permanecem.

-- Se VICTOR não deveria ser admin:
-- UPDATE profiles 
-- SET roles = ARRAY['member']::text[]
-- WHERE cpf = 'CPF_DO_VICTOR';

-- ============================================
