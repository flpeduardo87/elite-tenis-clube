import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from './IconComponents';

interface WeekNavigatorProps {
    currentDate: Date;
    onPreviousWeek: () => void;
    onNextWeek: () => void;
    onToday: () => void;
}

export const WeekNavigator: React.FC<WeekNavigatorProps> = ({ currentDate, onPreviousWeek, onNextWeek, onToday }) => {
    return (
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-card border border-gray-200/60">
            <div>
                <h2 className="text-xl md:text-2xl font-bold text-brand-dark capitalize">
                    <span className="md:hidden">{format(currentDate, "MMMM", { locale: ptBR })}</span>
                    <span className="hidden md:inline">{format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}</span>
                </h2>
                <p className="text-sm md:hidden text-gray-500 font-medium">{format(currentDate, "yyyy", { locale: ptBR })}</p>
            </div>
            <div className="flex items-center space-x-3">
                <button
                    onClick={onToday}
                    className="flex items-center px-4 py-2 border-2 border-brand-primary rounded-xl text-sm font-semibold text-brand-primary bg-white hover:bg-brand-primary hover:text-white transition-all duration-300 shadow-soft hover:shadow-card"
                >
                   <CalendarIcon className="h-4 w-4 mr-2"/> Hoje
                </button>
                <div className="flex items-center bg-gray-50 rounded-xl p-1">
                    <button
                        onClick={onPreviousWeek}
                        className="p-2 rounded-lg text-gray-600 hover:bg-white hover:text-brand-dark hover:shadow-soft transition-all duration-200"
                        aria-label="Semana anterior"
                    >
                        <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={onNextWeek}
                        className="p-2 rounded-lg text-gray-600 hover:bg-white hover:text-brand-dark hover:shadow-soft transition-all duration-200"
                        aria-label="Próxima semana"
                    >
                        <ChevronRightIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};