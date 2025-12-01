
import { createClient } from '@supabase/supabase-js';
import type { User, Booking, GameType } from './types';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { MASTER_ADMIN_CPF } from './constants';
import { addDays, startOfWeek, isSameDay, isWithinInterval, endOfWeek, subDays, format } from 'date-fns';

const demoUsers: User[] = [
    { id: 'master-admin-uuid', cpf: MASTER_ADMIN_CPF, first_name: 'Admin', last_name: 'Master', roles: ['member', 'admin'], is_blocked: false },
    { id: 'teacher-uuid', cpf: '111.111.111-11', first_name: 'Andre', last_name: 'Zucco', roles: ['member', 'teacher'], is_blocked: false },
    { id: 'user-1-uuid', cpf: '222.222.222-22', first_name: 'Victor Hugo', last_name: 'Orlikoski', roles: ['member'], is_blocked: false },
    { id: 'user-2-uuid', cpf: '333.333.333-33', first_name: 'Francielli Regina', last_name: 'Herbst Figel', roles: ['member'], is_blocked: false },
    { id: 'user-3-uuid', cpf: '444.444.444-44', first_name: 'Luiz Ricardo', last_name: 'Selenko', roles: ['member'], is_blocked: false },
    { id: 'user-4-uuid', cpf: '555.555.555-55', first_name: 'Luiz Gustavo', last_name: 'Wille', roles: ['member'], is_blocked: true },
    { id: 'user-5-uuid', cpf: '666.666.666-66', first_name: 'Felipe', last_name: 'Prado', roles: ['member'], is_blocked: false },
    { id: 'user-6-uuid', cpf: '777.777.777-77', first_name: 'Delbly', last_name: 'Machado', roles: ['member'], is_blocked: false },
];

const demoBookings: Booking[] = [
    {
        id: 'booking-1', created_at: new Date().toISOString(), court_id: 1, date: format(new Date(), 'yyyy-MM-dd'),
        time_slot_start: '18:00', time_slot_end: '19:00', member_id: demoUsers[2].cpf,
        opponent_id: demoUsers[3].cpf, game_type: 'normal', status: 'active', booked_by_id: demoUsers[2].id,
    },
    {
        id: 'booking-2', created_at: subDays(new Date(), 1).toISOString(), court_id: 2, date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
        time_slot_start: '09:00', time_slot_end: '10:30', member_id: demoUsers[1].cpf,
        opponent_id: '', game_type: 'class', status: 'active', booked_by_id: demoUsers[1].id,
    },
    {
        id: 'booking-3', created_at: new Date().toISOString(), court_id: 3, date: format(new Date(), 'yyyy-MM-dd'),
        time_slot_start: '17:00', time_slot_end: '18:00', member_id: demoUsers[4].cpf,
        opponent_id: '', game_type: 'beach_tennis', status: 'active', booked_by_id: demoUsers[4].id,
    },
];

const createMockSupabaseClient = () => {
    let users = [...demoUsers];
    let bookings = [...demoBookings];
    let listeners: ((event: string, session: Session | null) => void)[] = [];

    const createMockSession = (user: User): Session => ({
        access_token: `mock_token_for_${user.id}`,
        token_type: 'bearer',
        refresh_token: `mock_refresh_token_for_${user.id}`,
        expires_in: 3600,
        user: {
            id: user.id,
            app_metadata: {},
            user_metadata: { first_name: user.first_name, last_name: user.last_name, cpf: user.cpf },
            aud: 'authenticated',
            created_at: new Date().toISOString(),
        } as SupabaseUser,
    });

    let currentSession: Session | null = createMockSession(users[0]);

    const triggerAuthStateChange = (event: string, session: Session | null) => {
        listeners.forEach(listener => listener(event, session));
    };
    
    const mockAuth = {
        getSession: async () => ({ data: { session: currentSession }, error: null }),
        onAuthStateChange: (_callback: (event: string, session: Session | null) => void) => {
            listeners.push(_callback);
            return { data: { subscription: { unsubscribe: () => { listeners = listeners.filter(l => l !== _callback) } } } };
        },
        signOut: async () => {
            currentSession = null;
            triggerAuthStateChange('SIGNED_OUT', null);
            return { error: null };
        },
        setSession: (user: User) => { // Custom method for user switching in demo
            currentSession = createMockSession(user);
            triggerAuthStateChange('USER_UPDATED', currentSession);
        },
        signUp: async (options: any) => {
            const { phone, password, options: { data } } = options;
            if (users.some(u => u.cpf === data.cpf)) return { data: {}, error: { message: 'User already registered' } };
            const newUser: User = {
                id: crypto.randomUUID(),
                cpf: data.cpf,
                first_name: data.first_name,
                last_name: data.last_name,
                roles: ['member'],
                is_blocked: false,
            };
            users.push(newUser);
            return { data: { user: { id: newUser.id } }, error: null };
        },
        signInWithPassword: async ({ phone, email, password }: any) => {
            const user = users.find(u => {
                const cpfNumbers = u.cpf.replace(/\D/g, '');
                const userPhone = `+55${cpfNumbers}`;
                return (phone && userPhone === phone) || (email && email.includes(cpfNumbers));
            });
            if (user && !user.is_blocked) {
                currentSession = createMockSession(user);
                triggerAuthStateChange('SIGNED_IN', currentSession);
                return { data: { session: currentSession, user: currentSession.user }, error: null };
            }
            return { data: {}, error: { message: 'Invalid credentials' } };
        },
    };

    const mockFrom = (tableName: string) => ({
        select: (columns = '*') => ({
            eq: (column: string, value: any) => ({
                single: async () => {
                    if (tableName === 'profiles') {
                        const user = users.find(u => u[column as keyof User] === value);
                        return { data: user || null, error: user ? null : 'Not found' };
                    }
                    return { data: null, error: 'Not implemented' };
                }
            }),
            gte: (column: string, value: any) => ({
                lte: async (column2: string, value2: any) => {
                    if (tableName === 'bookings') {
                        const start = new Date(value);
                        const end = new Date(value2);
                        const results = bookings.filter(b => isWithinInterval(new Date(b.date), { start, end }));
                        return { data: results, error: null };
                    }
                    return { data: [], error: 'Not implemented' };
                }
            }),
            single: async () => ({ data: null, error: 'Not implemented' }),
            then: async (onfulfilled: (result: any) => void) => { // To support await supabase.from('...').select('*')
                if (tableName === 'profiles') onfulfilled({ data: users, error: null });
                if (tableName === 'bookings') onfulfilled({ data: bookings, error: null });
            },
        }),
        insert: (rows: any[]) => ({
            then: async (onfulfilled: (result: any) => void) => {
                 if (tableName === 'bookings') {
                    const newBooking = { ...rows[0], id: crypto.randomUUID(), created_at: new Date().toISOString() };
                    bookings.push(newBooking);
                    onfulfilled({ error: null });
                    // Simulate realtime update
                    if (mockChannelInstance.callback) mockChannelInstance.callback({ eventType: 'INSERT', new: newBooking });
                 } else if (tableName === 'profiles') {
                    // This is handled by signUp
                    onfulfilled({ error: null });
                 }
            }
        }),
        update: (values: any) => ({
            eq: (column: string, value: any) => ({
                then: async (onfulfilled: (result: any) => void) => {
                    if (tableName === 'profiles') {
                        users = users.map(u => u[column as keyof User] === value ? { ...u, ...values } : u);
                        onfulfilled({ error: null });
                    }
                }
            })
        }),
        delete: () => ({
            match: ({ id }: { id: string }) => ({
                 then: async (onfulfilled: (result: any) => void) => {
                    const bookingToDelete = bookings.find(b => b.id === id);
                    bookings = bookings.filter(b => b.id !== id);
                    onfulfilled({ error: null });
                    if (mockChannelInstance.callback) mockChannelInstance.callback({ eventType: 'DELETE', old: bookingToDelete });
                 }
            })
        })
    });
    
    const mockChannelInstance = {
        callback: null as ((payload: any) => void) | null,
        on: function(event: any, config: any, callback: (payload: any) => void) {
            this.callback = callback;
            return this;
        },
        subscribe: function() {
            return this;
        }
    };

    return {
        auth: mockAuth,
        from: mockFrom,
        channel: () => mockChannelInstance,
        removeChannel: () => {},
    };
};

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

export const isPreviewMode = !supabaseUrl || !supabaseAnonKey;

let supabaseExport: any;

if (isPreviewMode) {
    console.warn("Supabase credentials not found. Running in preview mode with mock data.");
    supabaseExport = createMockSupabaseClient();
} else {
    supabaseExport = createClient(supabaseUrl!, supabaseAnonKey!, {
        auth: {
            storage: window.localStorage,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
        },
    });
    // Simple connectivity test (non-blocking)
    (async () => {
        try {
            const { error } = await supabaseExport.from('profiles').select('id').limit(1);
            if (error) {
                console.error('[Supabase] Conexão estabelecida, mas a tabela profiles retornou erro:', error.message);
            } else {
                console.info('[Supabase] Conexão ok e tabela profiles acessível.');
            }
        } catch (e:any) {
            console.error('[Supabase] Falha ao testar conexão:', e?.message || e);
        }
    })();
}

export const supabase = supabaseExport;