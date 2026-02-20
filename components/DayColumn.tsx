
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
    releaseMessage?: string;
    isTeacherOrAdmin?: boolean;
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
    releaseMessage,
    isTeacherOrAdmin = false,
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
        <div className={`flex flex-col rounded-2xl shadow-card hover:shadow-hover transition-all duration-300 border border-gray-200/60 overflow-hidden ${(isClosed || (isPast && !isCurrentDay)) ? 'bg-gray-50' : 'bg-white'}`}>
            <div className={`text-center py-5 ${isCurrentDay ? 'bg-gradient-to-br from-brand-primary to-rose-600 text-white' : 'bg-gradient-to-br from-brand-dark to-slate-800 text-white'} ${(isPast && !isCurrentDay) ? '!bg-gradient-to-br !from-gray-400 !to-gray-500' : ''}`}>
                <p className="font-semibold text-sm uppercase tracking-wider opacity-90">{dayName}</p>
                <p className="font-bold text-4xl mt-1">{dayOfMonth}</p>
            </div>
            <div className="flex-grow p-4 space-y-2.5">
                {(isPast && !isCurrentDay) ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 py-8">
                        <div className="bg-gray-100 rounded-full p-4 mb-3">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <p className="text-sm font-semibold">Dia Encerrado</p>
                    </div>
                ) : isClosed ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 py-8">
                        <div className="bg-gray-100 rounded-full p-4 mb-3">
                            <LockIcon className="h-8 w-8" />
                        </div>
                        <p className="text-sm font-semibold">Fechado</p>
                    </div>
                ) : !isBookable ? (
                     <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center px-2 py-8">
                        <div className="bg-gray-100 rounded-full p-4 mb-3">
                            <LockIcon className="h-8 w-8" />
                        </div>
                        <p className="text-sm font-semibold">Agenda Fechada</p>
                        {releaseMessage && <p className="text-xs mt-2 opacity-80 leading-relaxed">{releaseMessage}</p>}
                    </div>
                ) : !areSlotsReleased && !isTeacherOrAdmin ? (
                     <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center px-2 py-8">
                        <div className="bg-gray-100 rounded-full p-4 mb-3">
                            <LockIcon className="h-8 w-8" />
                        </div>
                        <p className="text-sm font-semibold">Agenda Fechada</p>
                        {releaseMessage && <p className="text-xs mt-2 opacity-80 leading-relaxed">{releaseMessage}</p>}
                    </div>
                ) : (
                    <>
                        {!areSlotsReleased && isTeacherOrAdmin && releaseMessage && (
                            <div className="mb-3 bg-amber-50 border border-amber-200 rounded-lg p-2 text-center">
                                <p className="text-xs text-amber-800 font-medium">⚠️ Agenda não liberada</p>
                                <p className="text-[10px] text-amber-700 mt-0.5">{releaseMessage}</p>
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-2 text-center text-xs font-semibold text-gray-600 mb-1">
                            {courts.map(court => <span key={court.id} className="bg-gray-50 py-1.5 rounded-lg">{court.name}</span>)}
                        </div>
                        {timeSlots.map(slot => {
                            const [hours, minutes] = slot.start.split(':').map(Number);
                            const slotDateTime = set(date, { hours, minutes });
                            const isPastSlot = isBefore(slotDateTime, now);

                            return (
                                <div key={slot.start} className="grid grid-cols-2 gap-2">
                                    {courts.map((court) => {
                                        const booking = getBookingDetailsForSlot(date, slot, court.id);
                                        
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