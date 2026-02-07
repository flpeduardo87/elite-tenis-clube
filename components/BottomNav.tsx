import React from 'react';
import { CalendarIcon, UserCircleIcon, AdminPanelIcon, SunIcon } from './IconComponents';

interface BottomNavProps {
    activeView: 'tenis' | 'beach' | 'reservas' | 'perfil' | 'admin';
    onNavigate: (view: 'tenis' | 'beach' | 'reservas' | 'perfil' | 'admin') => void;
    courtType: 'tennis' | 'sand';
    isAdmin?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeView, onNavigate, courtType, isAdmin }) => {
    const navItems = [
        {
            id: 'tenis' as const,
            label: 'Tênis',
            icon: (active: boolean) => (
                <span
                    aria-label="Ícone Tênis"
                    className={`h-6 w-6 ${active ? 'bg-brand-primary' : 'bg-gray-500'} transition-colors`}
                    style={{
                        WebkitMaskImage: 'url(/icon-tennis.png)',
                        maskImage: 'url(/icon-tennis.png)',
                        WebkitMaskRepeat: 'no-repeat',
                        maskRepeat: 'no-repeat',
                        WebkitMaskPosition: 'center',
                        maskPosition: 'center',
                        WebkitMaskSize: 'contain',
                        maskSize: 'contain'
                    }}
                />
            )
        },
        {
            id: 'beach' as const,
            label: 'Beach',
            icon: (active: boolean) => (
                <SunIcon className={`h-6 w-6 ${active ? 'text-brand-primary' : 'text-gray-500'}`} />
            )
        },
        {
            id: 'reservas' as const,
            label: 'Minhas Reservas',
            icon: (active: boolean) => (
                <CalendarIcon className={`h-6 w-6 ${active ? 'text-brand-primary' : 'text-gray-500'}`} />
            )
        },
        {
            id: 'perfil' as const,
            label: 'Perfil',
            icon: (active: boolean) => (
                <UserCircleIcon className={`h-6 w-6 ${active ? 'text-brand-primary' : 'text-gray-500'}`} />
            )
        },
        {
            id: 'admin' as const,
            label: 'Admin',
            icon: (active: boolean) => (
                <AdminPanelIcon className={`h-6 w-6 ${active ? 'text-brand-primary' : 'text-gray-500'}`} />
            )
        }
    ];

    const visibleItems = isAdmin ? navItems : navItems.slice(0, 4);

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
            <div className="max-w-screen-2xl mx-auto px-2">
                <div className="flex justify-around items-center h-16">
                    {visibleItems.map((item) => {
                        // Lógica especial para Tênis e Beach baseado no courtType
                        let isActive = activeView === item.id;
                        if (item.id === 'tenis') {
                            isActive = courtType === 'tennis';
                        } else if (item.id === 'beach') {
                            isActive = courtType === 'sand';
                        }
                        
                        return (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[60px] ${
                                    isActive 
                                        ? 'text-brand-primary bg-green-50' 
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                {item.icon(isActive)}
                                <span className={`text-[10px] font-semibold ${isActive ? 'text-brand-primary' : 'text-gray-500'}`}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};
