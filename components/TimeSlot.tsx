import React from 'react';
import { set } from 'date-fns';
import type { Booking, TimeSlotInfo, User } from '../types';
import { XCircleIcon, LockIcon } from './IconComponents';

interface TimeSlotProps {
    timeSlot: TimeSlotInfo;
    booking: Booking | undefined;
    isPast: boolean;
    currentUser: User;
    usersMap: Map<string, User>;
    onBook: () => void;
    onCancel: () => void;
}

const SAND_SPORT_NAMES: Record<string, string> = {
    beach_volleyball: 'Vôlei',
    beach_tennis: 'Beach Tênis',
    footvolley: 'Futevôlei',
};

export const TimeSlot: React.FC<TimeSlotProps> = ({ timeSlot, booking, isPast, currentUser, usersMap, onBook, onCancel }) => {
    const commonClasses = "w-full text-center p-2 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center justify-center h-16 shadow-soft";

    // Calcular se foi agendamento de última hora (menos de 2 horas antes)
    const isLastMinuteBooking = React.useMemo(() => {
        if (!booking || !booking.created_at || !booking.date || !booking.time_slot_start) return false;
        
        const [hours, minutes] = booking.time_slot_start.split(':').map(Number);
        // Garantir que a data é criada corretamente no timezone local
        const dateStr = booking.date.includes('T') ? booking.date.split('T')[0] : booking.date;
        const bookingStartDateTime = set(new Date(dateStr + 'T00:00:00'), { hours, minutes, seconds: 0, milliseconds: 0 });
        const createdAtDateTime = new Date(booking.created_at);
        
        const hoursDifference = (bookingStartDateTime.getTime() - createdAtDateTime.getTime()) / (1000 * 60 * 60);
        
        // Debug log temporário
        if (booking.member_id === currentUser.cpf || booking.opponent_id === currentUser.cpf) {
            console.log('🔍 Verificando Quadra Livre:', {
                date: booking.date,
                time: booking.time_slot_start,
                bookingStartDateTime: bookingStartDateTime.toISOString(),
                createdAt: booking.created_at,
                createdAtDateTime: createdAtDateTime.toISOString(),
                hoursDifference: hoursDifference.toFixed(2),
                isLastMinute: hoursDifference < 2 && hoursDifference > 0
            });
        }
        
        return hoursDifference < 2 && hoursDifference > 0;
    }, [booking, currentUser.cpf]);

    if (!booking) {
        if (isPast) {
            return (
                <div className={`${commonClasses} bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200`}>
                    <span className="opacity-60">{timeSlot.start}</span>
                </div>
            );
        }
        return (
            <button
                onClick={onBook}
                className={`${commonClasses} bg-gradient-to-br from-emerald-50 to-green-50 text-emerald-700 hover:from-emerald-100 hover:to-green-100 hover:shadow-card hover:scale-105 border-2 border-dashed border-emerald-300 hover:border-emerald-400`}
            >
                <span className="font-bold">{timeSlot.start}</span>
            </button>
        );
    }

    const canCurrentUserCancel = !isPast && (booking.booked_by_id === currentUser.id || currentUser.roles.includes('admin'));
    const isSandSport = SAND_SPORT_NAMES.hasOwnProperty(booking.game_type);
    
    const member = usersMap.get(booking.member_id) || {
        first_name: booking.member_id,
        last_name: '',
        cpf: booking.member_id,
        roles: [],
        is_blocked: false
    };
    
    const opponent = booking.opponent_id 
        ? (usersMap.get(booking.opponent_id) || {
            first_name: booking.opponent_id,
            last_name: '',
            cpf: booking.opponent_id,
            roles: [],
            is_blocked: false
        })
        : null;

    const isBookedByCurrentUser = booking.member_id === currentUser.cpf;
    const isCurrentUserPlaying = isBookedByCurrentUser || booking.opponent_id === currentUser.cpf;
    const disabledSlotClasses = `${commonClasses} flex-col bg-gray-300 text-gray-600 cursor-not-allowed`;

    if (booking.game_type === 'interdiction') {
        const titleText = member ? `Interditado por ${member.first_name}` : "Interditado pela administração";
        const slotClasses = isPast ? disabledSlotClasses : `${commonClasses} flex-col bg-gradient-to-br from-amber-100 to-orange-100 text-amber-800 cursor-not-allowed border-2 border-amber-300 shadow-card`;
        return (
            <div className="relative group">
                <div className={slotClasses} title={titleText}>
                    <LockIcon className="h-5 w-5 mb-1"/>
                    <span className="text-[10px] font-bold uppercase tracking-wide">Interditada</span>
                </div>
                {canCurrentUserCancel && (
                    <button 
                        onClick={onCancel} 
                        className="absolute -top-2 -right-2 bg-[#EF001D] text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Cancelar interdição"
                    >
                        <XCircleIcon className="h-5 w-5" />
                    </button>
                )}
            </div>
        );
    }

    if (isSandSport) {
        const titleText = member ? `${SAND_SPORT_NAMES[booking.game_type]} - por ${member.first_name}` : SAND_SPORT_NAMES[booking.game_type];
        const slotClasses = isPast 
            ? disabledSlotClasses 
            : `${commonClasses} flex-col ${isBookedByCurrentUser ? 'bg-[#EF001D] text-white shadow-card' : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-800 shadow-card'} cursor-default`;
        
        return (
            <div className="relative group">
                <div className={slotClasses} title={titleText}>
                    <span className="font-bold text-sm">{SAND_SPORT_NAMES[booking.game_type]}</span>
                    <span className={`text-[10px] truncate mt-0.5 ${isPast ? 'text-gray-500' : (isBookedByCurrentUser ? 'text-rose-100' : 'text-gray-600')}`}>
                        {isBookedByCurrentUser ? 'Seu Jogo' : (member ? `por ${member.first_name}`: '')}
                    </span>
                </div>
                {canCurrentUserCancel && (
                    <button 
                        onClick={onCancel} 
                        className="absolute -top-2 -right-2 bg-[#EF001D] hover:bg-[#C90018] text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-card hover:scale-110"
                        aria-label="Cancelar agendamento"
                    >
                        <XCircleIcon className="h-5 w-5" />
                    </button>
                )}
            </div>
        );
    }

    if (booking.game_type === 'class') {
        const teacher = member;
        const displayText = teacher ? `Aula - ${teacher.first_name}` : booking.member_id;
        const slotClasses = isPast 
            ? disabledSlotClasses 
            : `${commonClasses} flex-col bg-gradient-to-br from-blue-500 to-indigo-600 text-white cursor-default shadow-card`;
        
        return (
            <div className="relative group">
                <div className={slotClasses} title={displayText}>
                    <span className="font-bold truncate max-w-full text-sm">Aula</span>
                    {teacher && <span className={`text-[10px] truncate mt-0.5 ${isPast ? 'text-gray-500' : 'text-blue-100'}`}>{teacher.first_name}</span>}
                </div>
                {canCurrentUserCancel && (
                    <button 
                        onClick={onCancel} 
                        className="absolute -top-2 -right-2 bg-[#EF001D] hover:bg-[#C90018] text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-card hover:scale-110"
                        aria-label="Cancelar aula"
                    >
                        <XCircleIcon className="h-5 w-5" />
                    </button>
                )}
            </div>
        );
    }

    if (isCurrentUserPlaying) {
        const titleText = `${member?.first_name} ${member?.last_name} vs ${opponent?.first_name || ''} ${opponent?.last_name || ''}`;
        
        // Cores diferentes para agendamentos de última hora (Quadra Livre)
        let slotClasses;
        if (isPast) {
            slotClasses = `${commonClasses} bg-gray-300 text-gray-600 cursor-not-allowed`;
        } else if (isLastMinuteBooking) {
            // Cor verde para jogos de quadra livre
            slotClasses = `${commonClasses} ${isBookedByCurrentUser ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-card' : 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-card'} text-white cursor-default flex-col`;
        } else {
            // Cor vermelha/rosa para jogos normais
            slotClasses = `${commonClasses} ${isBookedByCurrentUser ? 'bg-gradient-to-br from-rose-500 to-pink-600 shadow-card' : 'bg-gradient-to-br from-rose-400 to-pink-500 shadow-card'} text-white cursor-default flex-col`;
        }
        
        const vsClasses = isPast ? 'text-gray-500' : 'text-white/80';
        
        return (
            <div className="relative group">
                <div className={slotClasses} title={titleText}>
                    <span className="truncate max-w-full font-bold text-xs leading-tight">{isBookedByCurrentUser ? 'Você' : member?.first_name}</span>
                    <span className={`${vsClasses} text-[8px] font-semibold my-0.5`}>vs</span>
                    <span className="truncate max-w-full font-bold text-xs leading-tight">{isBookedByCurrentUser ? (opponent?.first_name || opponent?.cpf) : 'Você'}</span>
                </div>
                {booking.game_type === 'pyramid' && !isPast && (
                    <span className={`absolute top-2 ${isLastMinuteBooking ? 'right-8' : 'right-2'} ${isLastMinuteBooking ? 'bg-white text-green-600' : 'bg-white text-rose-600'} text-[9px] font-bold rounded-full h-5 w-5 flex items-center justify-center pointer-events-none shadow-sm`}>P</span>
                )}
                {isLastMinuteBooking && !isPast && (
                    <span className="absolute top-2 right-2 bg-white text-green-600 text-[9px] font-bold rounded-full h-5 w-5 flex items-center justify-center pointer-events-none shadow-sm" title="Quadra Livre (<2h)">
                        QL
                    </span>
                )}
                {canCurrentUserCancel && (
                    <button 
                        onClick={onCancel} 
                        className="absolute -top-2 -right-2 bg-[#EF001D] hover:bg-[#C90018] text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-card hover:scale-110"
                        aria-label="Cancelar agendamento"
                    >
                        <XCircleIcon className="h-5 w-5" />
                    </button>
                )}
            </div>
        );
    }

    const titleText = `${member?.first_name} ${member?.last_name} vs ${opponent?.first_name || opponent?.cpf || ''} ${opponent?.last_name || ''}`;
    
    // Cores diferentes para agendamentos de última hora (Quadra Livre)
    let slotClasses;
    if (isPast) {
        slotClasses = `${commonClasses} flex-col bg-gray-300 text-gray-600 cursor-not-allowed`;
    } else if (isLastMinuteBooking) {
        // Cor verde claro para jogos de quadra livre (outros jogadores)
        slotClasses = `${commonClasses} flex-col bg-gradient-to-br from-green-100 to-emerald-200 text-green-800 cursor-not-allowed border-2 border-green-300`;
    } else {
        // Cor cinza para jogos normais (outros jogadores)
        slotClasses = `${commonClasses} flex-col bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 cursor-not-allowed border-2 border-gray-300`;
    }
    
    return (
        <div className="relative group">
            <div className={slotClasses} title={titleText}>
                <span className="truncate max-w-full font-semibold text-xs leading-tight">{member?.first_name || member?.cpf}</span>
                <span className={`${isLastMinuteBooking ? 'text-green-600' : 'text-gray-500'} text-[8px] font-semibold my-0.5`}>vs</span>
                <span className="truncate max-w-full font-semibold text-xs leading-tight">{opponent?.first_name || opponent?.cpf || ''}</span>
                {booking.game_type === 'pyramid' && !isPast && (
                    <span className={`absolute top-2 ${isLastMinuteBooking ? 'right-8' : 'right-2'} ${isLastMinuteBooking ? 'bg-white text-green-600' : 'bg-gray-400 text-white'} text-[9px] font-bold rounded-full h-5 w-5 flex items-center justify-center pointer-events-none shadow-sm`}>P</span>
                )}
            </div>
            {isLastMinuteBooking && !isPast && (
                <span className="absolute top-2 right-2 bg-white text-green-600 text-[9px] font-bold rounded-full h-5 w-5 flex items-center justify-center pointer-events-none shadow-sm" title="Quadra Livre (<2h)">
                    QL
                </span>
            )}
            {canCurrentUserCancel && (
                <button 
                    onClick={onCancel} 
                    className="absolute -top-2 -right-2 bg-[#EF001D] hover:bg-[#C90018] text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-card hover:scale-110"
                    aria-label="Cancelar agendamento"
                >
                    <XCircleIcon className="h-5 w-5" />
                </button>
            )}
        </div>
    );
};
