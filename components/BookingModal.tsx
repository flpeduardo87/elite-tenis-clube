import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { isSameDay, format, isAfter, endOfWeek, startOfDay, startOfWeek, getDay, isWithinInterval, set, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import type { Booking, TimeSlotInfo, User, GameType } from '../types';
import { TENNIS_COURTS, SAND_COURTS } from '../constants';
import { XMarkIcon, UserIcon } from './IconComponents';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    slotInfo: {
        date: Date;
        timeSlot: TimeSlotInfo;
        courtId: number;
        isReleased: boolean;
    };
    onConfirm: (bookingDetails: { opponentId: string; gameType: GameType }) => Promise<{ success: boolean; error?: string }>;  // returns result to control loading
    currentUser: User;
    allUsers: User[];
    courtType: 'tennis' | 'sand';
    bookings: Booking[];
}

const sandGameTypes: { value: GameType, label: string }[] = [
    { value: 'beach_tennis', label: 'Beach Tênis' },
    { value: 'footvolley', label: 'Futevôlei' },
    { value: 'beach_volleyball', label: 'Vôlei de Praia' },
];

export const BookingModal: React.FC<BookingModalProps> = ({
    isOpen,
    onClose,
    slotInfo,
    onConfirm,
    currentUser,
    allUsers,
    courtType,
    bookings,
}) => {
    const [selectedOpponent, setSelectedOpponent] = useState<User | null>(null);
    const [gameType, setGameType] = useState<GameType>(courtType === 'tennis' ? 'normal' : 'beach_tennis');
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const isTeacher = useMemo(() => currentUser.roles.includes('teacher'), [currentUser.roles]);
    const isAdmin = useMemo(() => currentUser.roles.includes('admin'), [currentUser.roles]);
    
    // Determine if the slot is restricted for regular sócios
    const isRestrictedSlot = useMemo(() => {
        const today = new Date();
        const isFutureWeek = isAfter(startOfDay(slotInfo.date), endOfWeek(today, { weekStartsOn: 1 }));
        if (isFutureWeek) return true;

        const isCurrentWeek = isSameDay(startOfWeek(slotInfo.date, { weekStartsOn: 1 }), startOfWeek(today, { weekStartsOn: 1 }));
        if (!isCurrentWeek) return false; // Past weeks are not restricted in this sense

        const mondayThisWeek = startOfWeek(today, { weekStartsOn: 1 });
        const weeklyReleaseTime = set(mondayThisWeek, { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 });
        
        const thursdayThisWeek = addDays(mondayThisWeek, 3);
        const weekendReleaseTime = set(thursdayThisWeek, { hours: 10, minutes: 0, seconds: 0, milliseconds: 0 });

        const dayOfWeek = getDay(slotInfo.date);
        const isWeekendDay = dayOfWeek === 0 || dayOfWeek === 6;

        let isReleased;
        if (isWeekendDay) {
            isReleased = isAfter(today, weekendReleaseTime);
        } else {
            isReleased = isAfter(today, weeklyReleaseTime);
        }

        return !isReleased;
    }, [slotInfo.date]);


    const getBookingCountsForDay = useCallback((userCpf: string, forDate: Date) => {
        let tennisGamesToday = 0;
        let sandGamesToday = 0;
        if (!userCpf) return { tennisGamesToday, sandGamesToday };
    
        const tennisCourtIds = TENNIS_COURTS.map(c => c.id);
        const sandCourtIds = SAND_COURTS.map(c => c.id);
    
        bookings.forEach(b => {
            if (isSameDay(new Date(b.date), forDate)) {
                // Last-minute booking check: if booked less than 2 hours before, it doesn't count for limits.
                const [hours, minutes] = b.time_slot_start.split(':').map(Number);
                const bookingStartDateTime = set(new Date(b.date), { hours, minutes, seconds: 0, milliseconds: 0 });
                const createdAtDateTime = new Date(b.created_at);
    
                const hoursDifference = (bookingStartDateTime.getTime() - createdAtDateTime.getTime()) / (1000 * 60 * 60);
                if (hoursDifference < 2) {
                    return; // Does not count towards limits.
                }
    
                let isPlayerInvolved = false;
                let bookingCourtType: 'tennis' | 'sand' | null = null;
                
                if (tennisCourtIds.includes(b.court_id)) {
                    bookingCourtType = 'tennis';
                    if ((b.game_type === 'normal' || b.game_type === 'pyramid') && (b.member_id === userCpf || b.opponent_id === userCpf)) {
                        isPlayerInvolved = true;
                    }
                } else if (sandCourtIds.includes(b.court_id)) {
                    bookingCourtType = 'sand';
                    if (['beach_tennis', 'footvolley', 'beach_volleyball'].includes(b.game_type) && b.member_id === userCpf) {
                        isPlayerInvolved = true;
                    }
                }
    
                if (isPlayerInvolved) {
                    if (bookingCourtType === 'tennis') {
                        tennisGamesToday++;
                    } else if (bookingCourtType === 'sand') {
                        sandGamesToday++;
                    }
                }
            }
        });
    
        return { tennisGamesToday, sandGamesToday };
    }, [bookings]);


    const currentUserBookingCount = useMemo(() => getBookingCountsForDay(currentUser.cpf, slotInfo.date), [currentUser.cpf, slotInfo.date, getBookingCountsForDay]);
    const opponentBookingCount = useMemo(() => selectedOpponent ? getBookingCountsForDay(selectedOpponent.cpf, slotInfo.date) : { tennisGamesToday: 0, sandGamesToday: 0 }, [selectedOpponent, slotInfo.date, getBookingCountsForDay]);

    const usersForSelection = useMemo(() => {
        return allUsers.filter(user => {
            if (user.cpf === currentUser.cpf || user.is_blocked) {
                return false;
            }
            const userCounts = getBookingCountsForDay(user.cpf, slotInfo.date);
            return userCounts.tennisGamesToday < 1;
        }).sort((a, b) => a.first_name.localeCompare(b.first_name));
    }, [allUsers, currentUser.cpf, getBookingCountsForDay, slotInfo.date]);

    const filteredUsers = useMemo(() => {
        if (!searchTerm) return usersForSelection;
        return usersForSelection.filter(u =>
            `${u.first_name} ${u.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.cpf.includes(searchTerm)
        );
    }, [searchTerm, usersForSelection]);

    const isCurrentUserOverLimit = useMemo(() => {
        if (courtType === 'tennis') {
            return currentUserBookingCount.tennisGamesToday >= 1;
        }
        return currentUserBookingCount.sandGamesToday >= 1;
    }, [currentUserBookingCount, courtType]);

    const isOpponentOverLimit = useMemo(() => {
        return selectedOpponent ? opponentBookingCount.tennisGamesToday >= 1 : false;
    }, [opponentBookingCount, selectedOpponent]);

    const requiresOpponent = courtType === 'tennis' && (gameType === 'normal' || gameType === 'pyramid');
    
    const canConfirm = !currentUser.is_blocked &&
        !isCurrentUserOverLimit &&
        (!requiresOpponent || (selectedOpponent && !isOpponentOverLimit));


    useEffect(() => {
        if (isOpen) {
            if (isRestrictedSlot) {
                if (isTeacher) setGameType('class');
                else if (isAdmin) setGameType('interdiction');
            } else {
                setGameType(courtType === 'tennis' ? 'normal' : 'beach_tennis');
            }
        } else {
            setSelectedOpponent(null);
            setSearchTerm('');
            setIsDropdownOpen(false);
            setGameType(courtType === 'tennis' ? 'normal' : 'beach_tennis');
        }
    }, [isOpen, slotInfo.date, courtType, isRestrictedSlot, isTeacher, isAdmin]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectOpponent = (user: User) => {
        setSelectedOpponent(user);
        setSearchTerm(`${user.first_name} ${user.last_name}`);
        setIsDropdownOpen(false);
    };

    const handleConfirmClick = async () => {
        setSubmitError(null);
        setIsSubmitting(true);
        const res = await onConfirm({
            opponentId: selectedOpponent?.cpf || '',
            gameType
        });
        setIsSubmitting(false);
        if (res.success) {
            onClose();
        } else if (res.error) {
            setSubmitError(res.error);
        }
    };
    
    if (!isOpen) return null;

    const courtName = [...TENNIS_COURTS, ...SAND_COURTS].find(c => c.id === slotInfo.courtId)?.name || `Quadra ${slotInfo.courtId}`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 pb-28">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[calc(100vh-10rem)]">
                <div className="flex justify-between items-center p-4 border-b flex-shrink-0">
                    <h2 className="text-xl font-bold text-brand-dark">Confirmar Agendamento</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XMarkIcon className="h-6 w-6" /></button>
                </div>
                
                <div className="p-4 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 14rem)' }}>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Você está agendando:</p>
                        <p className="text-base font-semibold text-brand-dark">{courtName}</p>
                        <p className="text-sm font-medium text-brand-dark capitalize">{format(slotInfo.date, "EEEE, dd 'de' MMMM", { locale: ptBR })}</p>
                        <p className="text-sm font-medium text-brand-dark">Das {slotInfo.timeSlot.start} às {slotInfo.timeSlot.end}</p>
                    </div>

                    {courtType === 'tennis' && (
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Tipo de Jogo</label>
                            <select value={gameType} onChange={e => setGameType(e.target.value as GameType)} className="w-full p-2 border border-gray-300 rounded-md text-sm">
                                {isRestrictedSlot ? (
                                    <>
                                        {isTeacher && <option value="class">Aula</option>}
                                        {isAdmin && <option value="interdiction">Interditar</option>}
                                    </>
                                ) : (
                                    <>
                                        <option value="normal">Normal</option>
                                        <option value="pyramid">Pirâmide</option>
                                        {isTeacher && <option value="class">Aula</option>}
                                        {isAdmin && <option value="interdiction">Interditar</option>}
                                    </>
                                )}
                            </select>
                        </div>
                    )}

                    {courtType === 'sand' && (
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Modalidade</label>
                            <select value={gameType} onChange={e => setGameType(e.target.value as GameType)} className="w-full p-2 border border-gray-300 rounded-md text-sm">
                                {isRestrictedSlot ? (
                                     <>
                                        {isTeacher && <option value="class">Aula</option>}
                                        {isAdmin && <option value="interdiction">Interditar</option>}
                                    </>
                                ) : (
                                    <>
                                        {sandGameTypes.map(gt => <option key={gt.value} value={gt.value}>{gt.label}</option>)}
                                        {isTeacher && <option value="class">Aula</option>}
                                        {isAdmin && <option value="interdiction">Interditar</option>}
                                    </>
                                )}
                            </select>
                        </div>
                    )}
                    
                    {requiresOpponent && (
                        <div ref={dropdownRef} className="relative">
                            <label htmlFor="opponent" className="block text-xs font-medium text-gray-700 mb-1">Adversário</label>
                            <div className="relative mt-1">
                                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    id="opponent"
                                    type="text"
                                    value={searchTerm}
                                    onChange={e => { setSearchTerm(e.target.value); setIsDropdownOpen(true); setSelectedOpponent(null); }}
                                    onFocus={() => setIsDropdownOpen(true)}
                                    placeholder="Digite para buscar..."
                                    autoComplete="off"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm"
                                />
                                {isDropdownOpen && (
                                    <div className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-40 md:max-h-48 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-y-auto focus:outline-none sm:text-sm transform -translate-y-full -mt-2">
                                        {filteredUsers.length > 0 ? filteredUsers.map(user => (
                                            <div key={user.id} onClick={() => handleSelectOpponent(user)} className="cursor-pointer select-none relative py-2 pl-3 pr-9 text-gray-900 hover:bg-gray-100 border-b border-gray-100 last:border-b-0">
                                                <span className="font-normal block truncate">{user.first_name} {user.last_name}</span>
                                            </div>
                                        )) : (
                                            <div className="p-3 text-sm text-gray-500 text-center">
                                                {searchTerm ? 'Nenhum sócio encontrado com esse nome.' : 'Nenhum sócio disponível para este horário.'}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {submitError && (
                        <div className="text-xs text-red-700 bg-red-100 border border-red-200 p-2 rounded">
                            {submitError}
                        </div>
                    )}
                </div>

                <div className="flex justify-end p-4 bg-gray-50 rounded-b-lg flex-shrink-0">
                    <button onClick={onClose} className="px-4 py-2 mr-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
                    <button onClick={handleConfirmClick} disabled={!canConfirm || isSubmitting} className="px-4 py-2 bg-brand-red border border-transparent rounded-md text-sm font-medium text-white hover:bg-rose-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                        {isSubmitting ? 'Salvando...' : 'Confirmar'}
                    </button>
                </div>
            </div>
        </div>
    );
};