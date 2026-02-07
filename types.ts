
export interface TimeSlotInfo {
    start: string;
    end: string;
}

export type GameType = 'normal' | 'pyramid' | 'class' | 'beach_volleyball' | 'beach_tennis' | 'footvolley' | 'interdiction';

export interface User {
    id: string; // uuid from Supabase auth
    cpf: string;
    first_name: string;
    last_name: string;
    phone?: string;
    roles: ('member' | 'teacher' | 'admin')[];
    is_blocked: boolean;
}

export interface Booking {
    id: string;
    created_at: string;
    court_id: number;
    date: string; // ISO string for consistency
    time_slot_start: string;
    time_slot_end: string;
    member_id: string; // User CPF or Class Name
    opponent_id: string; // User CPF or empty
    game_type: GameType;
    status: 'active' | 'cancelled_by_admin';
    booked_by_id: string; // uuid of the user who made the booking
}

export interface BookingRestrictions {
    weekdayCount: number;
    weekendCount: number;
    pyramidWeekdays: number;
    pyramidWeekends: number;
    maxWeekdays: number;
    maxWeekends: number;
    canBookWeekday: boolean;
    canBookWeekend: boolean;
}

export interface BookingCounts {
    weekdayNormal: number;
    weekdayPyramid: number;
    weekendNormal: number;
    weekendPyramid: number;
}

export interface Notification {
    id: string;
    userId: string; // CPF of the user this is for
    message: string;
    createdAt: string; // ISO string
    read: boolean;
}