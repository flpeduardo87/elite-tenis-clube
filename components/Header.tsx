
import React, { useState, useRef, useEffect } from 'react';
import type { User, Notification } from '../types';
import { RulesIcon, AdminPanelIcon, BellIcon, CheckCircleIcon, TennisBallIcon, SunIcon, ChevronDownIcon, UserCircleIcon, ChevronLeftIcon, LogoutIcon, CalendarIcon } from './IconComponents';
import { isMasterAdmin } from '../src/utils';

interface NotificationBellProps {
    notifications: Notification[];
    onMarkAsRead: (notificationId: string) => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ notifications, onMarkAsRead }) => {
    const [isOpen, setIsOpen] = useState(false);
    const unreadCount = notifications.filter(n => !n.read).length;
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className="relative flex items-center text-sm font-medium text-gray-600 hover:text-brand-red transition-colors duration-200 px-2 h-10"
                aria-label="Ver notificações"
            >
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-red text-white text-xs font-bold">
                        {unreadCount}
                    </span>
                )}
            </button>
            {isOpen && (
                <div className="fixed sm:absolute right-4 sm:right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-md bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="p-2 border-b">
                        <h3 className="text-sm font-semibold text-gray-800">Notificações</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <p className="text-center text-sm text-gray-500 py-4">Nenhuma notificação.</p>
                        ) : (
                            notifications
                                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                .map(notification => (
                                <div key={notification.id} className={`p-3 border-b border-gray-100 ${notification.read ? 'bg-gray-50' : 'bg-white'}`}>
                                    <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-800'}`}>
                                        {notification.message}
                                    </p>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs text-gray-400">
                                            {new Date(notification.createdAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}
                                        </span>
                                        {!notification.read && (
                                            <button
                                                onClick={() => onMarkAsRead(notification.id)}
                                                className="flex items-center text-xs text-green-600 hover:text-green-800 font-semibold"
                                                title="Marcar como lida"
                                            >
                                                <CheckCircleIcon className="h-4 w-4 mr-1"/>
                                                Lida
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};


interface HeaderProps {
    currentUser: User;
    courtType: 'tennis' | 'sand';
    onSetCourtType: (type: 'tennis' | 'sand') => void;
    onShowRules: () => void;
    onShowAdminPanel: () => void;
    onShowMyBookings: () => void;
    notifications: Notification[];
    onMarkAsRead: (notificationId: string) => void;
    onGoBackToCourtSelection: () => void;
    onLogout?: () => void;
    onSwitchUser?: (user: User) => void;
    allUsers?: User[];
}

export const Header: React.FC<HeaderProps> = ({ 
    currentUser, 
    courtType, 
    onSetCourtType, 
    onShowRules, 
    onShowAdminPanel, 
    onShowMyBookings,
    notifications, 
    onMarkAsRead, 
    onGoBackToCourtSelection, 
    onLogout,
    onSwitchUser,
    allUsers,
}) => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const isMasterAdminCheck = isMasterAdmin(currentUser);
    const isAdmin = currentUser.roles.includes('admin');

    return (
        <header className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 pt-2 sm:pt-10 border-b border-gray-200/60">
            <div className="w-full sm:w-auto">
                <h1 className="text-2xl font-bold text-brand-dark tracking-tight mb-4 pt-0 sm:pt-[25px]">
                   Faça sua reserva
                </h1>
                <div className="flex items-center gap-3">
                    <button onClick={() => onSetCourtType('tennis')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 shadow-soft hover:shadow-card ${courtType === 'tennis' ? 'bg-gradient-to-r from-brand-primary to-rose-600 text-white scale-105' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}>
                       <span
                           aria-label="Ícone Tênis"
                           className={`h-4 w-4 ${courtType === 'tennis' ? 'bg-white' : 'bg-gray-700'} transition-colors`}
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
                       Tênis
                    </button>
                     <button onClick={() => onSetCourtType('sand')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 shadow-soft hover:shadow-card ${courtType === 'sand' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white scale-105' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}>
                       <SunIcon className="h-4 w-4"/> Beach
                    </button>
                </div>
            </div>
            <div className="flex items-center space-x-1 mt-4 sm:mt-0">
                <NotificationBell notifications={notifications} onMarkAsRead={onMarkAsRead} />
                <button 
                    onClick={onShowRules}
                    className="hidden md:flex items-center px-3 py-2 text-sm font-semibold text-gray-700 hover:text-brand-primary hover:bg-gray-50 rounded-xl transition-all duration-200 h-10"
                    aria-label="Ver regras do clube"
                >
                    <RulesIcon className="h-5 w-5 mr-1.5" />
                    Regras
                </button>
                <button
                    onClick={onShowMyBookings}
                    className="hidden md:flex items-center px-3 py-2 text-sm font-semibold text-gray-700 hover:text-brand-primary hover:bg-gray-50 rounded-xl transition-all duration-200 h-10"
                    aria-label="Ver minhas reservas"
                >
                    <CalendarIcon className="h-5 w-5 mr-1.5 text-gray-400" />
                    Minhas Reservas
                </button>
                <div ref={userMenuRef} className="relative">
                    <button
                        onClick={() => setIsUserMenuOpen(prev => !prev)}
                        className="flex items-center space-x-2 px-3 rounded-xl hover:bg-gray-50 transition-all duration-200 pt-[14px]"
                    >
                        <div className="text-left sm:text-right leading-tight">
                            <p className="text-sm font-bold text-brand-dark truncate leading-tight">{currentUser.first_name} {currentUser.last_name}</p>
                            <p className="text-xs text-gray-500 capitalize font-medium leading-tight">{currentUser.roles.map(r => r === 'member' ? 'Sócio' : r === 'teacher' ? 'Professor' : 'Admin').join(', ')}</p>
                        </div>
                        <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isUserMenuOpen && (
                        <div className="absolute left-1/2 -translate-x-1/2 sm:right-0 sm:left-auto sm:translate-x-0 mt-3 w-64 bg-white rounded-2xl shadow-hover ring-1 ring-black ring-opacity-5 z-20 overflow-hidden">
                            <div className="py-1.5">
                                <button
                                    onClick={() => { onShowMyBookings(); setIsUserMenuOpen(false); }}
                                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-brand-primary flex items-center transition-colors md:hidden"
                                >
                                    <CalendarIcon className="h-5 w-5 mr-3 text-gray-400" />
                                    Minhas Reservas
                                </button>
                                {(isAdmin || isMasterAdminCheck) && (
                                    <button
                                        onClick={() => { onShowAdminPanel(); setIsUserMenuOpen(false); }}
                                        className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-brand-primary flex items-center transition-colors"
                                    >
                                        <AdminPanelIcon className="h-5 w-5 mr-3 text-gray-400" />
                                        Painel do Admin
                                    </button>
                                )}
                                <button
                                    onClick={() => { onShowRules(); setIsUserMenuOpen(false); }}
                                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-brand-primary flex items-center transition-colors md:hidden"
                                >
                                    <RulesIcon className="h-5 w-5 mr-3 text-gray-400" />
                                    Regras
                                </button>
                                
                                {onSwitchUser && allUsers && (
                                    <>
                                        <div className="border-t border-gray-100 my-1.5"></div>
                                        <div className="px-4 pt-2.5 pb-1.5">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Trocar de Usuário</p>
                                        </div>
                                        <div className="max-h-60 overflow-y-auto">
                                            {allUsers.sort((a,b) => a.first_name.localeCompare(b.first_name)).map(user => (
                                                <button
                                                    key={user.id}
                                                    onClick={() => { onSwitchUser(user); setIsUserMenuOpen(false); }}
                                                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-brand-primary flex items-center transition-colors"
                                                >
                                                    <UserCircleIcon className="h-5 w-5 mr-3 text-gray-400" />
                                                    <span className="truncate">{user.first_name} {user.last_name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                                
                                {onLogout && (
                                    <>
                                    <div className="border-t border-gray-100 my-1.5"></div>
                                    <button
                                        onClick={() => { onLogout(); setIsUserMenuOpen(false); }}
                                        className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center transition-colors"
                                    >
                                        <LogoutIcon className="h-5 w-5 mr-3" />
                                        Sair (Logout)
                                    </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
