
import type { TimeSlotInfo } from './types';

export const MASTER_ADMIN_CPF = '358.350.678-28';

export const WEEKDAY_TIME_SLOTS: TimeSlotInfo[] = [
    { start: '09:00', end: '10:30' },
    { start: '10:30', end: '12:00' },
    { start: '12:00', end: '14:00' },
    { start: '14:00', end: '15:30' },
    { start: '15:30', end: '17:00' },
    { start: '17:00', end: '18:00' },
    { start: '18:00', end: '19:00' },
    { start: '19:00', end: '20:00' },
    { start: '20:00', end: '21:00' },
    { start: '21:00', end: '22:00' },
    { start: '22:00', end: '23:00' },
];

export const WEEKEND_TIME_SLOTS: TimeSlotInfo[] = [...WEEKDAY_TIME_SLOTS];

export const DAYS_OF_WEEK = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

export const TENNIS_COURTS = [{ id: 1, name: 'Quadra 1' }, { id: 2, name: 'Quadra 2' }];
export const SAND_COURTS = [{ id: 3, name: 'Areia 1' }, { id: 4, name: 'Areia 2' }];