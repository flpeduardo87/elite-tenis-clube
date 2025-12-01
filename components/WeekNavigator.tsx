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
        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl shadow-sm border border-gray-200/80">
            <h2 className="text-2xl font-bold text-brand-dark capitalize">
                {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
            </h2>
            <div className="flex items-center space-x-2">
                <button
                    onClick={onToday}
                    className="flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                   <CalendarIcon className="h-4 w-4 mr-1.5"/> Hoje
                </button>
                <div className="flex items-center">
                    <button
                        onClick={onPreviousWeek}
                        className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        aria-label="Semana anterior"
                    >
                        <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={onNextWeek}
                        className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        aria-label="Próxima semana"
                    >
                        <ChevronRightIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};