-- ============================================
-- CRIAR ADMIN - MÉTODO MAIS SIMPLES
-- ============================================

-- INSTRUÇÕES:
-- 1. Vá em Authentication > Users no painel Supabase
-- 2. Clique em "Add user" > "Create new user"
-- 3. Preencha:
--    Email: cpf35835067828@elitetenis.com.br
--    Password: elite123
--    ✅ MARQUE: "Auto Confirm User"
-- 4. Clique em "Create user"
-- 5. DEPOIS execute este SQL abaixo:

-- Atualizar/criar perfil e promover para admin
INSERT INTO public.profiles (id, cpf, first_name, last_name, roles, is_blocked)
SELECT 
  u.id,
  '358.350.678-28',
  'Felipe',
  'Prado',
  ARRAY['member', 'admin']::text[],
  FALSE
FROM auth.users u
WHERE u.email = 'cpf35835067828@elitetenis.com.br'
ON CONFLICT (id) DO UPDATE 
SET cpf = '358.350.678-28',
    first_name = 'Felipe',
    last_name = 'Prado',
    roles = ARRAY['member', 'admin']::text[],
    is_blocked = FALSE;

-- Atualizar por CPF também (caso o id seja diferente)
UPDATE public.profiles 
SET roles = ARRAY['member', 'admin']::text[],
    is_blocked = FALSE,
    first_name = 'Felipe',
    last_name = 'Prado'
WHERE cpf = '358.350.678-28';

-- Verificar resultado
SELECT 
  '✅ VERIFICAÇÃO' as status,
  u.email,
  p.cpf as cpf_login,
  p.first_name || ' ' || p.last_name as nome,
  p.roles,
  p.is_blocked,
  CASE 
    WHEN 'admin' = ANY(p.roles) THEN '✅ É ADMIN!' 
    ELSE '❌ NÃO É ADMIN'
  END as confirmacao
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'cpf35835067828@elitetenis.com.br';

-- ============================================
-- DEVE APARECER: "✅ É ADMIN!"
-- 
-- DADOS PARA LOGIN:
-- CPF: 358.350.678-28
-- Senha: elite123
-- ============================================
