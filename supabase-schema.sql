-- ============================================
-- SCHEMA DO BANCO DE DADOS - ELITE TÊNIS CLUBE
-- Sistema de Reserva de Quadras
-- ============================================

-- 1. CRIAR EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. TABELA DE PERFIS (profiles)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    roles TEXT[] DEFAULT ARRAY['member']::TEXT[], -- 'member' = sócio
    is_blocked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_profiles_cpf ON public.profiles(cpf);
CREATE INDEX IF NOT EXISTS idx_profiles_roles ON public.profiles USING GIN(roles);

-- ============================================
-- 3. TABELA DE RESERVAS (bookings)
-- ============================================
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    court_id INTEGER NOT NULL CHECK (court_id BETWEEN 1 AND 4),
    date DATE NOT NULL,
    time_slot_start TIME NOT NULL,
    time_slot_end TIME NOT NULL,
    member_id VARCHAR(14) NOT NULL,
    opponent_id VARCHAR(14) DEFAULT '',
    game_type VARCHAR(20) NOT NULL CHECK (game_type IN ('normal', 'pyramid', 'class', 'beach_volleyball', 'beach_tennis', 'footvolley', 'interdiction')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled')),
    booked_by_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Restrições de negócio
    CONSTRAINT no_overlapping_bookings UNIQUE (court_id, date, time_slot_start)
);

-- Índices para queries rápidas
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_court_date ON public.bookings(court_id, date);
CREATE INDEX IF NOT EXISTS idx_bookings_member ON public.bookings(member_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);

-- ============================================
-- 4. FUNÇÃO PARA ATUALIZAR updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualização automática
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. FUNÇÃO PARA CRIAR PERFIL APÓS SIGNUP
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, cpf, first_name, last_name, roles, is_blocked)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'cpf',
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name',
        ARRAY['member']::TEXT[],
        FALSE
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS nas tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- ===== POLICIES PARA PROFILES =====

-- Usuários podem ver todos os perfis (necessário para seleção de adversários)
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;
CREATE POLICY "Profiles are viewable by authenticated users"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

-- Usuários podem atualizar apenas seu próprio perfil
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Admins podem atualizar qualquer perfil
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND 'admin' = ANY(roles)
        )
    );

-- Admins podem inserir novos perfis
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
CREATE POLICY "Admins can insert profiles"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND 'admin' = ANY(roles)
        )
    );

-- ===== POLICIES PARA BOOKINGS =====

-- Usuários autenticados podem ver todas as reservas
DROP POLICY IF EXISTS "Bookings are viewable by authenticated users" ON public.bookings;
CREATE POLICY "Bookings are viewable by authenticated users"
    ON public.bookings FOR SELECT
    TO authenticated
    USING (true);

-- Usuários não bloqueados podem criar reservas
DROP POLICY IF EXISTS "Active users can create bookings" ON public.bookings;
CREATE POLICY "Active users can create bookings"
    ON public.bookings FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND is_blocked = FALSE
        )
    );

-- Usuários podem cancelar suas próprias reservas
DROP POLICY IF EXISTS "Users can delete own bookings" ON public.bookings;
CREATE POLICY "Users can delete own bookings"
    ON public.bookings FOR DELETE
    TO authenticated
    USING (
        booked_by_id = auth.uid()
    );

-- Admins e professores podem cancelar qualquer reserva
DROP POLICY IF EXISTS "Admins and teachers can delete any booking" ON public.bookings;
CREATE POLICY "Admins and teachers can delete any booking"
    ON public.bookings FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND ('admin' = ANY(roles) OR 'teacher' = ANY(roles))
        )
    );

-- ============================================
-- 7. DADOS INICIAIS (OPCIONAL - APENAS PARA TESTES)
-- ============================================

-- Inserir admin master (DESCOMENTAR E AJUSTAR APÓS CRIAR USUÁRIO MANUALMENTE)
-- UPDATE public.profiles 
-- SET roles = ARRAY['member', 'admin']::TEXT[] -- 'member' = sócio
-- WHERE cpf = '010.184.679-71';

-- ============================================
-- 8. FUNCTIONS ÚTEIS
-- ============================================

-- Função para verificar disponibilidade de horário
CREATE OR REPLACE FUNCTION check_slot_availability(
    p_court_id INTEGER,
    p_date DATE,
    p_time_start TIME
)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1 FROM public.bookings
        WHERE court_id = p_court_id
        AND date = p_date
        AND time_slot_start = p_time_start
        AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql;

-- Função para obter estatísticas do usuário
CREATE OR REPLACE FUNCTION get_user_stats(p_user_cpf VARCHAR)
RETURNS TABLE(
    total_bookings BIGINT,
    active_bookings BIGINT,
    upcoming_bookings BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::BIGINT AS total_bookings,
        COUNT(*) FILTER (WHERE status = 'active')::BIGINT AS active_bookings,
        COUNT(*) FILTER (WHERE status = 'active' AND date >= CURRENT_DATE)::BIGINT AS upcoming_bookings
    FROM public.bookings
    WHERE member_id = p_user_cpf OR opponent_id = p_user_cpf;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 9. VIEWS ÚTEIS
-- ============================================

-- View de reservas com informações completas
CREATE OR REPLACE VIEW bookings_detailed AS
SELECT 
    b.id,
    b.court_id,
    b.date,
    b.time_slot_start,
    b.time_slot_end,
    b.game_type,
    b.status,
    b.created_at,
    p1.first_name || ' ' || p1.last_name AS member_name,
    p1.cpf AS member_cpf,
    CASE 
        WHEN b.opponent_id = '' THEN NULL
        ELSE p2.first_name || ' ' || p2.last_name
    END AS opponent_name,
    b.opponent_id AS opponent_cpf,
    p3.first_name || ' ' || p3.last_name AS booked_by_name
FROM public.bookings b
LEFT JOIN public.profiles p1 ON b.member_id = p1.cpf
LEFT JOIN public.profiles p2 ON b.opponent_id = p2.cpf
LEFT JOIN public.profiles p3 ON b.booked_by_id = p3.id;

-- ============================================
-- FIM DO SCHEMA
-- ============================================

-- Para aplicar este schema:
-- 1. Acesse o Supabase Dashboard
-- 2. Vá em "SQL Editor"
-- 3. Cole este arquivo completo
-- 4. Execute (Run)
-- 5. Configure Authentication Providers:
--    - Authentication > Providers > Email (habilitar)
--    - Authentication > URL Configuration (ajustar redirect URLs)
