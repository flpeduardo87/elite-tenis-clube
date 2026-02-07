-- ============================================
-- PROMOVER USUÁRIO EXISTENTE PARA ADMIN
-- ============================================

-- Simplesmente atualizar o perfil para admin
UPDATE public.profiles 
SET roles = ARRAY['member', 'admin']::text[],
    is_blocked = FALSE
WHERE cpf = '358.350.678-28';

-- Verificar se funcionou
SELECT 
  '✅ RESULTADO' as status,
  p.cpf,
  p.first_name || ' ' || p.last_name as nome,
  p.roles,
  p.is_blocked,
  CASE 
    WHEN 'admin' = ANY(p.roles) THEN '✅ É ADMIN' 
    ELSE '❌ NÃO É ADMIN' 
  END as confirmacao
FROM public.profiles p
WHERE p.cpf = '358.350.678-28';

-- ============================================
-- Agora pode fazer login como admin:
-- CPF: 358.350.678-28
-- Senha: (a senha que você cadastrou)
-- ============================================
