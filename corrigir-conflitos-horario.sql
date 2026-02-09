-- ============================================
-- CORRIGIR CONFLITOS DE HORÁRIO EXISTENTES
-- ============================================

-- 1. IDENTIFICAR CONFLITOS (pessoas em 2 quadras ao mesmo tempo)
SELECT 
    b1.date,
    b1.time_slot_start,
    b1.court_id as quadra_1,
    b2.court_id as quadra_2,
    COALESCE(p1.first_name || ' ' || p1.last_name, b1.member_id) as usuario_conflito,
    b1.id as booking_id_1,
    b2.id as booking_id_2,
    b1.created_at as criado_1,
    b2.created_at as criado_2
FROM bookings b1
JOIN bookings b2 ON 
    b1.date = b2.date 
    AND b1.time_slot_start = b2.time_slot_start
    AND b1.court_id != b2.court_id
    AND b1.id != b2.id
LEFT JOIN profiles p1 ON (
    b1.member_id = p1.cpf OR b1.opponent_id = p1.cpf OR
    b2.member_id = p1.cpf OR b2.opponent_id = p1.cpf
)
WHERE 
    b1.status = 'active' 
    AND b2.status = 'active'
    AND (
        b1.member_id = b2.member_id OR
        b1.member_id = b2.opponent_id OR
        b1.opponent_id = b2.member_id OR
        b1.opponent_id = b2.opponent_id
    )
ORDER BY b1.date, b1.time_slot_start;

-- ============================================
-- 2. SOLUÇÃO: CANCELAR AGENDAMENTO MAIS RECENTE
-- ============================================

-- Exemplo: Se Luiz tem conflito às 17h
-- Cancele o agendamento mais recente (criado por último)

-- OPÇÃO A: Cancelar por ID específico
-- UPDATE bookings 
-- SET status = 'cancelled'
-- WHERE id = 'ID_DO_BOOKING_MAIS_RECENTE';

-- OPÇÃO B: Cancelar automaticamente TODOS os conflitos (mantém o mais antigo)
-- ATENÇÃO: Confira os IDs antes de executar!
/*
WITH conflitos AS (
    SELECT 
        b2.id,
        b1.created_at as created_1,
        b2.created_at as created_2
    FROM bookings b1
    JOIN bookings b2 ON 
        b1.date = b2.date 
        AND b1.time_slot_start = b2.time_slot_start
        AND b1.court_id != b2.court_id
        AND b1.id != b2.id
    WHERE 
        b1.status = 'active' 
        AND b2.status = 'active'
        AND b2.created_at > b1.created_at
        AND (
            b1.member_id = b2.member_id OR
            b1.member_id = b2.opponent_id OR
            b1.opponent_id = b2.member_id OR
            b1.opponent_id = b2.opponent_id
        )
)
UPDATE bookings 
SET status = 'cancelled'
WHERE id IN (SELECT id FROM conflitos);
*/

-- ============================================
-- 3. VERIFICAR RESULTADO
-- ============================================

SELECT 
    date,
    time_slot_start,
    court_id,
    member_id,
    opponent_id,
    status,
    created_at
FROM bookings
WHERE status = 'active'
  AND date >= CURRENT_DATE
ORDER BY date, time_slot_start, court_id;
