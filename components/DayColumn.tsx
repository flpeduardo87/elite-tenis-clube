
import React from 'react';
import { format, isToday, isBefore, set } from 'date-fns';
import type { Booking, TimeSlotInfo, User } from '../types';
import { TimeSlot } from './TimeSlot';
import { LockIcon } from './IconComponents';

interface Court {
    id: number;
    name: string;
}

interface DayColumnProps {
    date: Date;
    dayName: string;
    timeSlots: TimeSlotInfo[];
    isClosed: boolean;
    areSlotsReleased: boolean;
    isBookable: boolean;
    isPast: boolean;
    getBookingDetailsForSlot: (date: Date, timeSlot: TimeSlotInfo, courtId: number) => Booking | undefined;
    onBookSlot: (date: Date, timeSlot: TimeSlotInfo, courtId: number) => void;
    onCancelBooking: (bookingId: string) => void;
    currentUser: User | null;
    usersMap: Map<string, User>;
    courts: Court[];
}

export const DayColumn: React.FC<DayColumnProps> = ({
    date,
    dayName,
    timeSlots,
    isClosed,
    areSlotsReleased,
    isBookable,
    isPast,
    getBookingDetailsForSlot,
    onBookSlot,
    onCancelBooking,
    currentUser,
    usersMap,
    courts,
}) => {
    const isCurrentDay = isToday(date);
    const dayOfMonth = format(date, 'd');
    const now = new Date();

    if (!currentUser) return null; // Don't render if no user

    return (
        <div className={`flex flex-col rounded-xl shadow-sm border border-gray-200/80 ${(isClosed || (isPast && !isCurrentDay)) ? 'bg-gray-100' : 'bg-gray-50'}`}>
            <div className={`text-center py-4 rounded-t-xl ${isCurrentDay ? 'bg-brand-red text-white' : 'bg-brand-dark text-white'} ${(isPast && !isCurrentDay) ? '!bg-gray-400' : ''}`}>
                <p className="font-semibold text-base">{dayName}</p>
                <p className="font-bold text-3xl">{dayOfMonth}</p>
            </div>
            <div className="flex-grow p-3 space-y-3">
                {(isPast && !isCurrentDay) ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <p className="mt-2 text-sm font-semibold">Dia Encerrado</p>
                    </div>
                ) : isClosed ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <LockIcon className="h-8 w-8" />
                        <p className="mt-2 text-sm font-semibold">Fechado</p>
                    </div>
                ) : !isBookable ? (
                     <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center px-2">
                        <LockIcon className="h-8 w-8" />
                        <p className="mt-2 text-sm font-semibold">Semana Futura</p>
                         <p className="text-xs">Apenas na semana atual.</p>
                    </div>
                ) : !areSlotsReleased ? (
                     <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center px-2">
                        <LockIcon className="h-8 w-8" />
                        <p className="mt-2 text-sm font-semibold">Aguardando Liberação</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold text-gray-500">
                            {courts.map(court => <span key={court.id}>{court.name}</span>)}
                        </div>
                        {timeSlots.map(slot => {
                            const [hours, minutes] = slot.start.split(':').map(Number);
                            const slotDateTime = set(date, { hours, minutes });
                            const isPastSlot = isBefore(slotDateTime, now);

                            return (
                                <div key={slot.start} className="grid grid-cols-2 gap-2">
                                    {courts.map((court) => {
                                        const booking = getBookingDetailsForSlot(date, slot, court.id);
                                        
                                        // Log para verificar se booking está chegando ao TimeSlot
                                        if (booking) {
                                            console.log('🎾 DayColumn passando booking para TimeSlot:', {
                                                date: format(date, 'yyyy-MM-dd'),
                                                slot: slot.start,
                                                court: court.id,
                                                bookingId: booking.id,
                                                member: booking.member_id
                                            });
                                        }
                                        
                                        return (
                                            <TimeSlot
                                                key={`${slot.start}-${court.id}`}
                                                timeSlot={slot}
                                                booking={booking}
                                                isPast={isPastSlot}
                                                currentUser={currentUser}
                                                usersMap={usersMap}
                                                onBook={() => onBookSlot(date, slot, court.id)}
                                                onCancel={() => booking && onCancelBooking(booking.id)}
                                            />
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </>
                )}
            </div>
        </div>
    );
};