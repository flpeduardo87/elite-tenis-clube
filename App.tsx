
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { addDays, startOfWeek, getDay, isAfter, set, isSameDay, endOfWeek, isBefore, startOfDay, addWeeks, subWeeks, endOfDay, format } from 'date-fns';
import { supabase, isPreviewMode } from './supabaseClient';
import type { Booking, TimeSlotInfo, User, GameType, Notification } from './types';
import { WEEKDAY_TIME_SLOTS, WEEKEND_TIME_SLOTS, DAYS_OF_WEEK, TENNIS_COURTS, SAND_COURTS } from './constants';
import { Header } from './components/Header';
import { WeekNavigator } from './components/WeekNavigator';
import { DayColumn } from './components/DayColumn';
import { BookingModal } from './components/BookingModal';
import { MyBookingsModal } from './components/MyBookingsModal';
import { PasswordResetModal } from './components/PasswordResetModal';
import { RulesModal } from './components/RulesModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { CourtTypeSelector } from './components/CourtTypeSelector';
import { AuthPage } from './components/AuthPage';
import type { Session } from '@supabase/supabase-js';
import { isMasterAdmin, isValidCPF, handleSupabaseError, generateTempPassword } from './src/utils';
import { ChevronLeftIcon, ChevronRightIcon } from './components/IconComponents';

const pollForProfile = async (userId: string, retries = 5, delay = 500): Promise<User | null> => {
    for (let i = 0; i < retries; i++) {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
        if (data && !error) {
            return data as User;
        }
        await new Promise(res => setTimeout(res, delay));
    }
    return null;
};

const App: React.FC = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<{ date: Date; timeSlot: TimeSlotInfo; courtId: number; isReleased: boolean } | null>(null);
    const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
    const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
    const [courtType, setCourtType] = useState<'tennis' | 'sand'>('tennis');
    const [initialCourtTypeSelected, setInitialCourtTypeSelected] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [mustResetPassword, setMustResetPassword] = useState<boolean>(false);
    const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
    const [myBookingsCache, setMyBookingsCache] = useState<Booking[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const usersMap = useMemo(() => new Map(users.map(u => [u.cpf, u])), [users]);
    const startOfWeekDate = useMemo(() => startOfWeek(currentDate, { weekStartsOn: 1 }), [currentDate]);
    const today = useMemo(() => new Date(), []);

    // Função de carregamento de dados
    const fetchAllData = useCallback(async (currentSession: Session | null) => {
        console.log('🚀 INICIANDO fetchAllData...');
        setLoading(true);
        setErrorMessage(null);
        try {
            if (!currentSession) {
                setLoading(false);
                setErrorMessage('Usuário não autenticado. Faça login para acessar o sistema.');
                return;
            }
            // Buscar perfil do usuário logado
            const { data: userProfile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', currentSession.user.id)
                .single();
            if (profileError || !userProfile) {
                setLoading(false);
                setErrorMessage('Erro ao carregar perfil do usuário. Verifique se o usuário existe no Supabase.');
                return;
            }
            setCurrentUser(userProfile as User);

            // Buscar lista de usuários
            const { data: allUsers, error: usersError } = await supabase
                .from('profiles')
                .select('*');
            if (usersError || !allUsers) {
                setErrorMessage('Erro ao carregar lista de usuários. Verifique a tabela profiles no Supabase.');
            } else {
                setUsers(allUsers as User[]);
            }

            // Buscar reservas
            const { data: allBookings, error: bookingsError } = await supabase
                .from('bookings')
                .select('*');
            console.log('📥 Resultado busca Supabase:', { allBookings, bookingsError });
            if (bookingsError || !allBookings) {
                console.error('❌ ERRO ao carregar bookings:', bookingsError);
                setErrorMessage('Erro ao carregar reservas. Verifique a tabela bookings no Supabase.');
            } else {
                console.log('✅ ✅ ✅ BOOKINGS CARREGADOS:', allBookings.length, 'reservas');
                console.table(allBookings);
                setBookings(allBookings as Booking[]);
                console.log('✅ setBookings chamado com', allBookings.length, 'itens');
            }
        } catch (err: any) {
            setErrorMessage('Erro inesperado ao conectar ao Supabase: ' + (err?.message || err));
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            fetchAllData(session);
        });

        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            fetchAllData(session);
            if (session?.user?.user_metadata?.must_change_password) {
                setMustResetPassword(true);
            }
        });

        return () => subscription.unsubscribe();
    }, [fetchAllData]);

    // Função de cancelamento de reserva corrigida
    const handleCancelBooking = async (bookingId: number) => {
        const bookingToCancel = bookings.find(b => b.id === bookingId);
        if (!bookingToCancel) return;
        const { error } = await supabase.from('bookings').delete().match({ id: bookingId });
        if (error) {
            console.error("Error cancelling booking:", error);
            return;
        }
        setBookings(prev => prev.filter(b => b.id !== bookingId));
        const opponent = usersMap.get(bookingToCancel.opponent_id);
        const booker = usersMap.get(bookingToCancel.member_id);
        if (opponent) {
            addNotification(bookingToCancel.opponent_id, `Sua reserva em ${bookingToCancel.date} às ${bookingToCancel.time_slot_start} foi cancelada por ${booker?.name || 'outro jogador'}.`);
        }
    };

    const addNotification = useCallback((userId: string, message: string) => {
        const newNotification: Notification = {
            id: crypto.randomUUID(),
            userId,
            message,
            createdAt: new Date().toISOString(),
            read: false,
        };
        setNotifications(prev => [newNotification, ...prev]);
    }, []);

    // Funções placeholder para restaurar funcionamento
    const handleSelectCourtType = (type: 'tennis' | 'sand') => {
        setCourtType(type);
        setInitialCourtTypeSelected(true);
    };
    // Função para obter detalhes da reserva para um slot
    const getBookingDetailsForSlot = useCallback((date: Date, timeSlot: TimeSlotInfo, courtId: number) => {
        const slotDateStr = date.toISOString().split('T')[0];
        
        console.log('🔍 Buscando booking para:', {
            data: slotDateStr,
            horario: timeSlot.start,
            quadra: courtId,
            tipo: courtType,
            totalBookings: bookings.length
        });
        
        const booking = bookings.find(b => {
            const bookingDateStr = b.date.includes('T') ? b.date.split('T')[0] : b.date;
            const isCourtTypeMatch = (courtType === 'tennis' && b.court_id <= 2) || (courtType === 'sand' && b.court_id >= 3);
            
            const dateMatch = bookingDateStr === slotDateStr;
            const timeMatch = b.time_slot_start === timeSlot.start || b.time_slot_start === `${timeSlot.start}:00`;
            const courtMatch = b.court_id === courtId;
            const statusMatch = b.status === 'active';
            
            const match = dateMatch && timeMatch && courtMatch && statusMatch && isCourtTypeMatch;
            
            // Log detalhado para cada booking verificado
            if (dateMatch && timeMatch && courtMatch) {
                console.log('🔎 Verificando booking:', {
                    id: b.id,
                    dateMatch,
                    timeMatch,
                    courtMatch,
                    statusMatch,
                    isCourtTypeMatch,
                    match
                });
            }
            
            // Log detalhado para cada booking verificado
            if (dateMatch && timeMatch && courtMatch) {
                console.log('🔎 Verificando booking:', {
                    id: b.id,
                    dateMatch,
                    timeMatch,
                    courtMatch,
                    statusMatch,
                    isCourtTypeMatch,
                    match,
                    booking: b
                });
            }
            
            if (match) {
                console.log('✅ Booking ENCONTRADO:', {
                    id: b.id,
                    date: bookingDateStr,
                    slot: b.time_slot_start,
                    court: b.court_id,
                    member: b.member_id,
                    opponent: b.opponent_id
                });
            }
            
            return match;
        });
        
        if (!booking) {
            console.log('❌ Nenhum booking encontrado para:', slotDateStr, timeSlot.start, courtId);
        }
        
        return booking;
    }, [bookings, courtType]);

    // Função para selecionar um slot para agendamento
    const handleBookSlot = (date: Date, timeSlot: TimeSlotInfo, courtId: number) => {
        // Verifica se o slot está liberado
        setSelectedSlot({ date, timeSlot, courtId, isReleased: true });
    };
    const handleGoBackToCourtSelection = () => setInitialCourtTypeSelected(false);
    const handlePreviousWeek = () => setCurrentDate(prev => subWeeks(prev, 1));
    const handleNextWeek = () => setCurrentDate(prev => addWeeks(prev, 1));
    const handleToday = () => setCurrentDate(new Date());

    const handleConfirmBooking = async (details: { opponentId: string, gameType: GameType }): Promise<{ success: boolean; error?: string }> => {
        if (!selectedSlot || !currentUser) return { success: false, error: 'Seleção inválida' };

        const newBooking: Omit<Booking, 'id' | 'created_at'> = {
            court_id: selectedSlot.courtId,
            date: selectedSlot.date.toISOString().split('T')[0],
            time_slot_start: selectedSlot.timeSlot.start,
            time_slot_end: selectedSlot.timeSlot.end,
            member_id: currentUser.cpf,
            opponent_id: details.opponentId,
            game_type: details.gameType,
            status: 'active',
            booked_by_id: currentUser.id,
        };

        const { error } = await supabase.from('bookings').insert([newBooking]);
        if (error) {
            const friendly = handleSupabaseError(error) || 'Erro ao criar agendamento';
            console.error('Erro ao criar agendamento:', error);
            return { success: false, error: friendly };
        }
        return { success: true };
    };

    const handleToggleBlockUser = async (cpf: string) => {
        const userToUpdate = users.find(u => u.cpf === cpf);
        if (!userToUpdate) return;
        const newBlockedState = !userToUpdate.is_blocked;

        const { error } = await supabase.from('profiles').update({ is_blocked: newBlockedState }).eq('cpf', cpf);
        if (error) {
            console.error("Error updating user block status:", error.message);
        } else {
            setUsers(prev => prev.map(u => u.cpf === cpf ? { ...u, is_blocked: newBlockedState } : u));
        }
    };

    const handleToggleUserRole = async (cpf: string, role: 'teacher' | 'admin') => {
        const userToUpdate = users.find(u => u.cpf === cpf);
        if (!userToUpdate) return;
        const newRoles = userToUpdate.roles.includes(role) ? userToUpdate.roles.filter(r => r !== role) : [...userToUpdate.roles, role];

        const { error } = await supabase.from('profiles').update({ roles: newRoles }).eq('cpf', cpf);
        if (error) {
            console.error("Error updating user role:", error.message);
        } else {
            setUsers(prev => prev.map(u => u.cpf === cpf ? { ...u, roles: newRoles } : u));
        }
    };

    // Editar nome do sócio
    const handleEditUserBasic = async (cpf: string, firstName: string, lastName: string): Promise<{ success: boolean; error?: string }> => {
        const { error } = await supabase.from('profiles').update({ first_name: firstName, last_name: lastName }).eq('cpf', cpf);
        if (error) return { success: false, error: handleSupabaseError(error) };
        setUsers(prev => prev.map(u => u.cpf === cpf ? { ...u, first_name: firstName, last_name: lastName } : u));
        return { success: true };
    };

    // Exclusão (soft delete): bloqueia e anonimiza mantendo histórico de reservas
    const handleDeleteUserSoft = async (cpf: string): Promise<{ success: boolean; error?: string }> => {
        const { error } = await supabase.from('profiles').update({ is_blocked: true, first_name: '[REMOVIDO]', last_name: '' }).eq('cpf', cpf);
        if (error) return { success: false, error: handleSupabaseError(error) };
        setUsers(prev => prev.map(u => u.cpf === cpf ? { ...u, is_blocked: true, first_name: '[REMOVIDO]', last_name: '' } : u));
        return { success: true };
    };
    
    const handleSingleUserRegister = async (details: { cpf: string; firstName: string; lastName: string; }): Promise<{ success: boolean; error?: string; tempPassword?: string; }> => {
        if (!isValidCPF(details.cpf)) {
            return { success: false, error: 'CPF inválido. Verifique os dígitos.' };
        }
        const { data: existingUser } = await supabase.from('profiles').select('cpf').eq('cpf', details.cpf).single();
        if (existingUser) return { success: false, error: 'CPF já cadastrado no sistema.' };

        const cpfNumbers = details.cpf.replace(/\D/g, '');
        const phone = `+55${cpfNumbers}`;
        const email = `cpf${cpfNumbers}@elitetenis.com.br`; // Fallback email

        const tempPassword = generateTempPassword();

        const { data: authData, error: authError } = await supabase.auth.signUp({
            phone,
            email,
            password: tempPassword,
            options: {
                data: {
                    first_name: details.firstName,
                    last_name: details.lastName,
                    cpf: details.cpf,
                    must_change_password: true,
                }
            }
        });

        if (authError) {
            if (authError.message.toLowerCase().includes('rate limit')) {
                 return { success: false, error: `Erro: Muitas tentativas. Por favor, aguarde um momento.` };
            }
            if (authError.message.toLowerCase().includes('phone')) {
                return { success: false, error: `Erro na autenticação: O provedor de login por telefone não está habilitado. Por favor, ative-o no painel do Supabase em Authentication > Providers.` };
            }
               return { success: false, error: handleSupabaseError(authError) };
        }

        if (!authData.user) {
            return { success: false, error: 'Erro desconhecido ao criar usuário.' };
        }

        if (isPreviewMode) { // In preview, profile is created synchronously
               await fetchAllData(session); 
               return { success: true, tempPassword };
        }

        const profile = await pollForProfile(authData.user.id);
        if (!profile) {
            return { success: false, error: 'O usuário foi autenticado, mas falhou ao criar o perfil no banco de dados. Contate o suporte.' };
        }
        
        await fetchAllData(session); 
        return { success: true, tempPassword };
    };

    const handleBulkUserRegister = async (userData: string): Promise<{ success: number; failed: number; errors: string[]; credentials: { cpf: string; password: string }[]; }> => {
        const lines = userData.split('\n').filter(line => line.trim() !== '');
        let success = 0; let failed = 0; const errors: string[] = []; const credentials: { cpf: string; password: string }[] = [];

        for (const line of lines) {
            const [cpf, firstName, lastName] = line.split(';').map(s => s.trim());
            if (!cpf || !firstName || !lastName) { failed++; errors.push(`Dados incompletos: ${line}`); continue; }
            if (!isValidCPF(cpf)) { failed++; errors.push(`${cpf}: CPF inválido.`); continue; }
            const result = await handleSingleUserRegister({ cpf, firstName, lastName });
            if (result.success) {
                 success++;
                 credentials.push({ cpf, password: result.tempPassword || '' });
            } else {
                failed++;
                errors.push(`${cpf}: ${result.error}`);
                if (result.error?.toLowerCase().includes('muitas tentativas')) {
                    errors.push('Processo interrompido devido ao limite de requisições. Tente o restante mais tarde.');
                    break; 
                }
            }
             if(!isPreviewMode) await new Promise(res => setTimeout(res, 250));
        }
        await fetchAllData(session);
        return { success, failed, errors, credentials };
    };
    
    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    const handleSwitchUser = (user: User) => {
        if (isPreviewMode) {
            (supabase.auth as any).setSession(user);
        }
    };

    const handleMarkAsRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

    const handlePasswordReset = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
        const { error } = await supabase.auth.updateUser({ password: newPassword, data: { must_change_password: false } });
        if (error) {
            return { success: false, error: handleSupabaseError(error) };
        }
        setMustResetPassword(false);
        return { success: true };
    };

    const fetchUserBookings = async (): Promise<Booking[]> => {
        if (!currentUser) return [];
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .or(`member_id.eq.${currentUser.cpf},opponent_id.eq.${currentUser.cpf}`)
            .order('date', { ascending: false })
            .limit(200);
        if (error) {
            console.error('Erro ao carregar reservas do usuário:', error.message);
            return myBookingsCache; // fallback
        }
        const mapped = (data || []).map(b => ({
            ...b,
            date: `${b.date}T00:00:00`,
            time_slot_start: typeof b.time_slot_start === 'string' ? b.time_slot_start.slice(0,5) : b.time_slot_start,
            time_slot_end: typeof b.time_slot_end === 'string' ? b.time_slot_end.slice(0,5) : b.time_slot_end,
        })) as Booking[];
        setMyBookingsCache(mapped);
        return mapped;
    };

    // ...todos os hooks e funções já estão acima...
    // Remover bloco duplicado de return abaixo do principal

    // Fallback removido: bloco try/catch não permitido em componentes React

    const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(startOfWeekDate, i)), [startOfWeekDate]);
    const [activeMobileDay, setActiveMobileDay] = useState(0);
    const touchStartXRef = useRef<number | null>(null);
    useEffect(() => { setActiveMobileDay(0); }, [startOfWeekDate]);
    const isTeacherOrAdmin = currentUser && currentUser.roles.includes('teacher') || currentUser && currentUser.roles.includes('admin');
    const isMasterAdminCheck = currentUser ? isMasterAdmin(currentUser) : false;

    const renderDayColumn = useCallback((date: Date, index: number) => {
        const dayOfWeek = getDay(date);
        const isMonday = dayOfWeek === 1;
        const isPast = isBefore(endOfDay(date), startOfDay(today));

        const isFutureWeek = isAfter(startOfDay(date), endOfWeek(today, { weekStartsOn: 1 }));
        const isBookable = !isFutureWeek || isTeacherOrAdmin;
        let areSlotsReleased = false;
        const isCurrentWeek = isSameDay(startOfWeek(date, { weekStartsOn: 1 }), startOfWeek(today, { weekStartsOn: 1 }));

        if (isTeacherOrAdmin || !isCurrentWeek) {
            areSlotsReleased = true;
        } else {
            const mondayThisWeek = startOfWeek(today, { weekStartsOn: 1 });
            const weekdayReleaseTime = set(mondayThisWeek, { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 });
            const fridayThisWeek = addDays(mondayThisWeek, 4);
            const weekendReleaseTime = set(fridayThisWeek, { hours: 10, minutes: 0, seconds: 0, milliseconds: 0 });
            const isWeekendDay = dayOfWeek === 0 || dayOfWeek === 6;
            if (isWeekendDay) {
                areSlotsReleased = isAfter(today, weekendReleaseTime) || isSameDay(today, weekendReleaseTime);
            } else {
                areSlotsReleased = isAfter(today, weekdayReleaseTime) || isSameDay(today, weekdayReleaseTime);
            }
        }

        return (
            <DayColumn
                key={date.toISOString()}
                date={date}
                dayName={DAYS_OF_WEEK[index]}
                timeSlots={dayOfWeek === 0 || dayOfWeek === 6 ? WEEKEND_TIME_SLOTS : WEEKDAY_TIME_SLOTS}
                isClosed={isMonday}
                areSlotsReleased={areSlotsReleased}
                isBookable={isBookable}
                isPast={isPast}
                getBookingDetailsForSlot={getBookingDetailsForSlot}
                onBookSlot={handleBookSlot}
                onCancelBooking={handleCancelBooking}
                currentUser={currentUser}
                usersMap={usersMap}
                courts={courtType === 'tennis' ? TENNIS_COURTS : SAND_COURTS}
            />
        );
    }, [getBookingDetailsForSlot, handleBookSlot, handleCancelBooking, currentUser, usersMap, courtType, today, isTeacherOrAdmin]);

    return (
        <div className="p-4 sm:p-6 md:p-8 max-w-screen-2xl mx-auto font-sans">
            {/* Exibir tela de login se não houver sessão/autenticação */}
            {!session && (
                <div className="flex items-center justify-center min-h-[60vh]">
                    <AuthPage />
                </div>
            )}

            {/* Painel de erro detalhado */}
            {session && errorMessage && (
                <div className="p-8">
                    <h2 className="text-lg font-bold mb-2 text-red-700">Erro ao carregar dados</h2>
                    <div className="bg-red-100 p-4 rounded text-sm text-red-800 mb-4">{errorMessage}</div>
                    <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">
{JSON.stringify({
    currentUser,
    users,
    bookings,
    courtType,
    initialCourtTypeSelected
}, null, 2)}
                    </pre>
                    <div className="mt-4 text-red-600">Verifique as variáveis de ambiente, credenciais do Supabase, autenticação do usuário e se há dados nas tabelas.</div>
                </div>
            )}

            {/* Painel de debug visual (fallback antigo) */}
            {session && !errorMessage && (!users.length || !bookings.length || !currentUser) && (
                <div className="p-8">
                    <h2 className="text-lg font-bold mb-2">Painel de Debug</h2>
                    <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">
{JSON.stringify({
    currentUser,
    users,
    bookings,
    courtType,
    initialCourtTypeSelected
}, null, 2)}
                    </pre>
                    <div className="mt-4 text-red-600">Dados insuficientes para renderizar o calendário. Verifique se há usuários e reservas cadastrados no Supabase.</div>
                    {/* Painel visual de agendamentos para debug */}
                            <div className="mt-8">
                                <h3 className="text-md font-semibold mb-2">Agendamentos filtrados para esta semana e tipo de quadra:</h3>
                                {(() => {
                                    const startOfWeekStr = startOfWeekDate.toISOString().split('T')[0];
                                    const endOfWeekStr = format(addDays(startOfWeekDate, 6), 'yyyy-MM-dd');
                                    const filteredBookings = bookings.filter(b => {
                                        const bookingDateStr = b.date.includes('T') ? b.date.split('T')[0] : b.date;
                                        const isCourtTypeMatch = (courtType === 'tennis' && b.court_id <= 2) || (courtType === 'sand' && b.court_id >= 3);
                                        return (
                                            bookingDateStr >= startOfWeekStr &&
                                            bookingDateStr <= endOfWeekStr &&
                                            b.status === 'active' &&
                                            isCourtTypeMatch
                                        );
                                    });
                                    if (filteredBookings.length === 0) {
                                        return <div className="text-gray-500">Nenhum agendamento encontrado para esta semana e tipo de quadra.</div>;
                                    }
                                    return (
                                        <table className="min-w-full text-xs border">
                                            <thead>
                                                <tr className="bg-gray-200">
                                                    <th className="border px-2 py-1">ID</th>
                                                    <th className="border px-2 py-1">Data</th>
                                                    <th className="border px-2 py-1">Horário</th>
                                                    <th className="border px-2 py-1">Quadra</th>
                                                    <th className="border px-2 py-1">Membro</th>
                                                    <th className="border px-2 py-1">Oponente</th>
                                                    <th className="border px-2 py-1">Tipo</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredBookings.map(b => (
                                                    <tr key={b.id} className="border-b">
                                                        <td className="border px-2 py-1">{b.id}</td>
                                                        <td className="border px-2 py-1">{b.date}</td>
                                                        <td className="border px-2 py-1">{b.time_slot_start} - {b.time_slot_end}</td>
                                                        <td className="border px-2 py-1">{b.court_id}</td>
                                                        <td className="border px-2 py-1">{b.member_id}</td>
                                                        <td className="border px-2 py-1">{b.opponent_id}</td>
                                                        <td className="border px-2 py-1">{b.game_type}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    );
                                })()}
                            </div>
                </div>
            )}

            {/* ...existing code... */}
            {session && users.length > 0 && bookings.length > 0 && currentUser && !errorMessage && (
            <>
            <Header 
                currentUser={currentUser}
                courtType={courtType}
                onSetCourtType={setCourtType}
                onShowRules={() => setIsRulesModalOpen(true)}
                onShowAdminPanel={() => setIsAdminPanelOpen(true)}
                onShowMyBookings={() => setIsMyBookingsOpen(true)}
                notifications={notifications.filter(n => n.userId === currentUser.cpf)}
                onMarkAsRead={handleMarkAsRead}
                onGoBackToCourtSelection={handleGoBackToCourtSelection}
                onLogout={!isPreviewMode ? handleLogout : undefined}
                onSwitchUser={isPreviewMode ? handleSwitchUser : undefined}
                allUsers={isPreviewMode ? users : undefined}
            />

            <main>
                <WeekNavigator currentDate={currentDate} onPreviousWeek={handlePreviousWeek} onNextWeek={handleNextWeek} onToday={handleToday} />

                {/* Mobile: Carousel (one day at a time) */}
                <div className="block md:hidden mt-6">
                    <div className="flex items-center justify-between mb-3">
                        <button
                            onClick={() => setActiveMobileDay(i => Math.max(0, i - 1))}
                            disabled={activeMobileDay === 0}
                            className={`p-2 rounded-full hover:bg-gray-100 ${activeMobileDay === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                            aria-label="Dia anterior"
                        >
                            <ChevronLeftIcon className="h-5 w-5" />
                        </button>
                        <div className="text-sm font-semibold text-gray-800">
                            {DAYS_OF_WEEK[activeMobileDay]} • {format(days[activeMobileDay], 'dd/MM')}
                        </div>
                        <button
                            onClick={() => setActiveMobileDay(i => Math.min(6, i + 1))}
                            disabled={activeMobileDay === 6}
                            className={`p-2 rounded-full hover:bg-gray-100 ${activeMobileDay === 6 ? 'opacity-40 cursor-not-allowed' : ''}`}
                            aria-label="Próximo dia"
                        >
                            <ChevronRightIcon className="h-5 w-5" />
                        </button>
                    </div>

                    <div
                        onTouchStart={(e) => { touchStartXRef.current = e.changedTouches[0].clientX; }}
                        onTouchEnd={(e) => {
                            const startX = touchStartXRef.current;
                            if (startX == null) return;
                            const deltaX = e.changedTouches[0].clientX - startX;
                            const threshold = 40; // px
                            if (deltaX > threshold) setActiveMobileDay(i => Math.max(0, i - 1));
                            if (deltaX < -threshold) setActiveMobileDay(i => Math.min(6, i + 1));
                            touchStartXRef.current = null;
                        }}
                    >
                        {renderDayColumn(days[activeMobileDay], activeMobileDay)}
                    </div>

                    <div className="flex justify-center gap-2 mt-3">
                        {days.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveMobileDay(i)}
                                className={`h-2 w-2 rounded-full ${i === activeMobileDay ? 'bg-brand-red' : 'bg-gray-300'}`}
                                aria-label={`Ir para ${DAYS_OF_WEEK[i]}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Desktop: Weekly grid */}
                <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-7 gap-4 mt-6">
                    {days.map((date, index) => renderDayColumn(date, index))}
                </div>
            </main>

            {selectedSlot && (
                <BookingModal
                    isOpen={!!selectedSlot}
                    onClose={() => setSelectedSlot(null)}
                    slotInfo={selectedSlot}
                    onConfirm={handleConfirmBooking}
                    currentUser={currentUser}
                    allUsers={users}
                    courtType={courtType}
                    bookings={bookings}
                />
            )}

            <RulesModal isOpen={isRulesModalOpen} onClose={() => setIsRulesModalOpen(false)} />
            <PasswordResetModal isOpen={mustResetPassword} onClose={() => {}} onConfirm={handlePasswordReset} />
            <MyBookingsModal isOpen={isMyBookingsOpen} onClose={() => setIsMyBookingsOpen(false)} currentUser={currentUser} fetchUserBookings={fetchUserBookings} onCancelBooking={async (id) => { await handleCancelBooking(id); fetchUserBookings(); }} />
            
            {(isTeacherOrAdmin || isMasterAdminCheck) && (
                 <AdminPanelModal
                    isOpen={isAdminPanelOpen}
                    onClose={() => setIsAdminPanelOpen(false)}
                    users={users}
                    onToggleBlock={handleToggleBlockUser}
                    onToggleRole={handleToggleUserRole}
                    onSingleRegister={handleSingleUserRegister}
                    onBulkRegister={handleBulkUserRegister}
                    onEditUser={handleEditUserBasic}
                    onDeleteUser={handleDeleteUserSoft}
                    currentUser={currentUser}
                />
            )}
            </>
            )}
        </div>
    );
};

export default App;
