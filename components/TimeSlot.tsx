import React from 'react';
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
    const commonClasses = "w-full text-center p-1 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center h-14";

    // Log para verificar se booking está chegando
    if (booking) {
        console.log('🏓 TimeSlot recebeu booking:', {
            slot: timeSlot.start,
            bookingId: booking.id,
            member: booking.member_id,
            opponent: booking.opponent_id,
            gameType: booking.game_type
        });
    }

    if (!booking) {
        if (isPast) {
            return (
                <div className={`${commonClasses} bg-gray-200 text-gray-400 cursor-not-allowed`}>
                    {timeSlot.start}
                </div>
            );
        }
        return (
            <button
                onClick={onBook}
                className={`${commonClasses} bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-dashed border-emerald-300`}
            >
                {timeSlot.start}
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
        const slotClasses = isPast ? disabledSlotClasses : `${commonClasses} flex-col bg-amber-100 text-amber-800 cursor-not-allowed border border-dashed border-amber-400`;
        return (
            <div className="relative group">
                <div className={slotClasses} title={titleText}>
                    <LockIcon className="h-4 w-4 mb-0.5"/>
                    <span className="text-[10px] font-bold">Interditada</span>
                </div>
                {canCurrentUserCancel && (
                    <button 
                        onClick={onCancel} 
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
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
            : `${commonClasses} flex-col ${isBookedByCurrentUser ? 'bg-rose-600 text-white' : 'bg-gray-300 text-gray-800'} cursor-default`;
        
        return (
            <div className="relative group">
                <div className={slotClasses} title={titleText}>
                    <span className="font-bold">{SAND_SPORT_NAMES[booking.game_type]}</span>
                    <span className={`text-[10px] truncate ${isPast ? 'text-gray-500' : (isBookedByCurrentUser ? 'text-rose-200' : 'text-gray-500')}`}>
                        {isBookedByCurrentUser ? 'Seu Jogo' : (member ? `por ${member.first_name}`: '')}
                    </span>
                </div>
                {canCurrentUserCancel && (
                    <button 
                        onClick={onCancel} 
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
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
            : `${commonClasses} flex-col bg-slate-400 text-white cursor-default`;
        
        return (
            <div className="relative group">
                <div className={slotClasses} title={displayText}>
                    <span className="font-bold truncate max-w-full">{teacher ? `Aula` : booking.member_id}</span>
                    {teacher && <span className={`text-[10px] truncate ${isPast ? 'text-gray-500' : 'text-slate-200'}`}>{teacher.first_name}</span>}
                </div>
                {canCurrentUserCancel && (
                    <button 
                        onClick={onCancel} 
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
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
        const slotClasses = isPast
            ? `${commonClasses} bg-gray-300 text-gray-600 cursor-not-allowed`
            : `${commonClasses} ${isBookedByCurrentUser ? 'bg-rose-600' : 'bg-rose-400'} text-white cursor-default flex-col`;
        const vsClasses = isPast ? 'text-gray-500' : 'text-rose-200';
        
        return (
            <div className="relative group">
                <div className={slotClasses} title={titleText}>
                    <span className="truncate max-w-full font-semibold">{isBookedByCurrentUser ? 'Você' : member?.first_name}</span>
                    <span className={`${vsClasses} text-[10px]`}>vs</span>
                    <span className="truncate max-w-full font-semibold">{isBookedByCurrentUser ? (opponent?.first_name || opponent?.cpf) : 'Você'}</span>
                </div>
                {booking.game_type === 'pyramid' && !isPast && (
                    <span className="absolute top-1.5 right-1.5 bg-white text-brand-dark text-[8px] font-bold rounded-full h-4 w-4 flex items-center justify-center pointer-events-none">P</span>
                )}
                {canCurrentUserCancel && (
                    <button 
                        onClick={onCancel} 
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Cancelar agendamento"
                    >
                        <XCircleIcon className="h-5 w-5" />
                    </button>
                )}
            </div>
        );
    }

    const titleText = `${member?.first_name} ${member?.last_name} vs ${opponent?.first_name || opponent?.cpf || ''} ${opponent?.last_name || ''}`;
    const slotClasses = isPast 
        ? `relative ${commonClasses} flex-col bg-gray-300 text-gray-600 cursor-not-allowed`
        : `relative ${commonClasses} flex-col bg-gray-200 text-gray-700 cursor-not-allowed`;
    
    return (
        <div className={slotClasses} title={titleText}>
            <span className="truncate max-w-full font-semibold">{member?.first_name || member?.cpf}</span>
            <span className="text-gray-500 text-[10px]">vs</span>
            <span className="truncate max-w-full font-semibold">{opponent?.first_name || opponent?.cpf || ''}</span>
            {booking.game_type === 'pyramid' && !isPast && (
                <span className="absolute top-1.5 right-1.5 bg-gray-400 text-white text-[8px] font-bold rounded-full h-3 w-3 flex items-center justify-center pointer-events-none">P</span>
            )}
        </div>
    );
};
