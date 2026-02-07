

import React, { useState } from 'react';
import type { User } from '../types';
import { XMarkIcon, LockIcon } from './IconComponents';
import { BulkUserRegistration } from './BulkUserRegistration';
import { AddSingleUser } from './AddSingleUser';
import { isMasterAdmin } from '../src/utils';

interface AdminPanelModalProps {
    isOpen: boolean;
    onClose: () => void;
    users: User[];
    onToggleBlock: (cpf: string) => void;
    onToggleRole: (cpf: string, role: 'teacher' | 'admin') => void;
    onSingleRegister: (details: { cpf: string; firstName: string; lastName: string; phone?: string }) => Promise<{ success: boolean; error?: string; tempPassword?: string }>;
    onBulkRegister: (userData: string) => Promise<{ success: number; failed: number; errors: string[]; credentials: { cpf: string; password: string }[] }>;
    onEditUser: (cpf: string, firstName: string, lastName: string) => Promise<{ success: boolean; error?: string }>;
    onDeleteUser: (cpf: string) => Promise<{ success: boolean; error?: string }>;
    onResetPassword: (cpf: string) => Promise<{ success: boolean; error?: string; tempPassword?: string }>;
    currentUser: User;
}

const roleNames: Record<'member' | 'teacher' | 'admin', string> = {
    member: 'Sócio',
    teacher: 'Professor',
    admin: 'Admin',
};
const roleColors: Record<'member' | 'teacher' | 'admin', string> = {
    member: 'bg-blue-100 text-blue-800',
    teacher: 'bg-purple-100 text-purple-800',
    admin: 'bg-yellow-100 text-yellow-800',
};

const UserManagement: React.FC<Pick<AdminPanelModalProps, 'users' | 'onToggleBlock' | 'onToggleRole' | 'currentUser' | 'onEditUser' | 'onDeleteUser' | 'onResetPassword'>> = ({ users, onToggleBlock, onToggleRole, currentUser, onEditUser, onDeleteUser, onResetPassword }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [editingCpf, setEditingCpf] = useState<string | null>(null);
    const [editFirstName, setEditFirstName] = useState('');
    const [editLastName, setEditLastName] = useState('');
    const [editError, setEditError] = useState<string | null>(null);
    const [editLoading, setEditLoading] = useState(false);
    const [resetPasswordResult, setResetPasswordResult] = useState<{ cpf: string; password: string } | null>(null);
    
    const isCurrentUserMasterAdmin = isMasterAdmin(currentUser);
    const isAdmin = currentUser.roles.includes('admin');

    const filteredUsers = users
        .filter(user => {
            const searchTermLower = searchTerm.toLowerCase();
            const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
            return fullName.includes(searchTermLower) || user.cpf.includes(searchTermLower);
        })
        .sort((a, b) => `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`));

    return (
        <div className="flow-root">
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Buscar por nome, sobrenome ou CPF..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-red focus:border-brand-red sm:text-sm"
                />
            </div>
            <ul role="list" className="-my-5 divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                    const isUserTheMasterAdmin = isMasterAdmin(user);
                    
                    // An admin can block a non-admin. Master admin can block any admin (except himself).
                    const canBlock = !isUserTheMasterAdmin && (!user.roles.includes('admin') || isCurrentUserMasterAdmin);
                    // Role toggles are available for admins, but not for the master admin.
                    const canToggleRoles = isAdmin && !isUserTheMasterAdmin;

                    const isEditing = editingCpf === user.cpf;
                    return (
                    <li key={user.cpf} className="py-2">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-4">
                            <div className="flex-1 min-w-0 mb-2 sm:mb-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    {isEditing ? (
                                        <div className="flex flex-col sm:flex-row gap-2 w-full">
                                            <input
                                                value={editFirstName}
                                                onChange={e => setEditFirstName(e.target.value)}
                                                className="px-2 py-1 border rounded w-full sm:w-40 text-sm"
                                                placeholder="Nome"
                                            />
                                            <input
                                                value={editLastName}
                                                onChange={e => setEditLastName(e.target.value)}
                                                className="px-2 py-1 border rounded w-full sm:w-40 text-sm"
                                                placeholder="Sobrenome"
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {user.first_name} {user.last_name}
                                        </p>
                                    )}
                                    {user.roles.map(role => (
                                        <span key={role} className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[role]}`}>
                                            {roleNames[role]}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500 truncate">
                                    {user.cpf}
                                </p>
                                {isEditing && editError && (
                                    <p className="text-xs text-red-600 mt-1">{editError}</p>
                                )}
                            </div>
                                <div className="flex items-center space-x-2 w-full sm:w-auto justify-between">
                                <div className="flex items-center space-x-2">
                                    {user.is_blocked && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            Bloqueado
                                        </span>
                                    )}
                                    {canBlock && (
                                        <button
                                            onClick={() => onToggleBlock(user.cpf)}
                                            className={`inline-flex items-center shadow-sm px-3 py-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-white ${
                                                user.is_blocked ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                            } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                                        >
                                            {user.is_blocked ? 'Desbloquear' : 'Bloquear'}
                                        </button>
                                    )}
                                    {canBlock && !isEditing && (
                                        <button
                                            onClick={() => { setEditingCpf(user.cpf); setEditFirstName(user.first_name); setEditLastName(user.last_name); setEditError(null); }}
                                            className="inline-flex items-center shadow-sm px-3 py-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >Editar
                                        </button>
                                    )}
                                    {isEditing && (
                                        <>
                                            <button
                                                onClick={async () => {
                                                    if (!editFirstName.trim() || !editLastName.trim()) {
                                                        setEditError('Nome e sobrenome são obrigatórios');
                                                        return;
                                                    }
                                                    setEditLoading(true);
                                                    const res = await onEditUser(user.cpf, editFirstName.trim(), editLastName.trim());
                                                    setEditLoading(false);
                                                    if (res.success) {
                                                        setEditingCpf(null);
                                                    } else {
                                                        setEditError(res.error || 'Erro ao salvar');
                                                    }
                                                }}
                                                disabled={editLoading}
                                                className="inline-flex items-center shadow-sm px-3 py-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
                                            >{editLoading ? 'Salvando...' : 'Salvar'}</button>
                                            <button
                                                onClick={() => { setEditingCpf(null); setEditError(null); }}
                                                className="inline-flex items-center shadow-sm px-3 py-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                                            >Cancelar</button>
                                        </>
                                    )}
                                    {canBlock && !isEditing && (
                                        <>
                                            <button
                                                onClick={async () => {
                                                    if (confirm('Confirmar exclusão? O sócio será excluído permanentemente do sistema.')) {
                                                        await onDeleteUser(user.cpf);
                                                    }
                                                }}
                                                className="inline-flex items-center shadow-sm px-3 py-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                            >Excluir</button>
                                            <button
                                                onClick={async () => {
                                                    const result = await onResetPassword(user.cpf);
                                                    if (result.success && result.tempPassword) {
                                                        setResetPasswordResult({ cpf: user.cpf, password: result.tempPassword });
                                                    } else {
                                                        alert(result.error || 'Erro ao resetar senha');
                                                    }
                                                }}
                                                className="inline-flex items-center shadow-sm px-3 py-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >Resetar Senha</button>
                                        </>
                                    )}
                                </div>
                                {canToggleRoles && (
                                    <div className="flex flex-col space-y-2 border-l pl-4">
                                        <label className="flex items-center text-sm cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={user.roles.includes('teacher')}
                                                onChange={() => onToggleRole(user.cpf, 'teacher')}
                                                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                            />
                                            <span className="ml-2 text-gray-700">Professor</span>
                                        </label>
                                        {isAdmin && (
                                            <label className="flex items-center text-sm cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={user.roles.includes('admin')}
                                                    onChange={() => onToggleRole(user.cpf, 'admin')}
                                                    className="h-4 w-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                                                />
                                                <span className="ml-2 text-gray-700">Admin</span>
                                            </label>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </li>
                )})}
            </ul>
            
            {/* Modal para mostrar senha resetada */}
            {resetPasswordResult && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-green-600 mb-3">✓ Senha Resetada!</h3>
                        <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-4">
                            <p className="text-sm text-gray-600 mb-2">CPF: <strong>{resetPasswordResult.cpf}</strong></p>
                            <p className="text-sm text-gray-600 mb-2">Nova senha temporária:</p>
                            <p className="text-lg font-mono font-bold text-gray-900 bg-yellow-100 p-3 rounded border-2 border-yellow-300 break-all">
                                {resetPasswordResult.password}
                            </p>
                        </div>
                        <p className="text-xs text-red-600 mb-4">
                            ⚠️ Copie esta senha agora! Ela não será mostrada novamente.
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(resetPasswordResult.password);
                                    alert('Senha copiada!');
                                }}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-semibold"
                            >
                                Copiar Senha
                            </button>
                            <button
                                onClick={() => setResetPasswordResult(null)}
                                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm font-semibold"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({ isOpen, onClose, users, onToggleBlock, onToggleRole, onSingleRegister, onBulkRegister, onEditUser, onDeleteUser, onResetPassword, currentUser }) => {
    const [activeTab, setActiveTab] = useState<'manage' | 'single' | 'bulk'>('manage');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 pb-28 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl my-8 max-h-[calc(100vh-8rem)] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b flex-shrink-0">
                    <h2 className="text-xl font-bold text-brand-dark">Painel do Administrador</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="border-b border-gray-200 flex-shrink-0">
                    <nav className="-mb-px flex space-x-1 sm:space-x-6 px-2 sm:px-6" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('manage')}
                            className={`${
                                activeTab === 'manage'
                                ? 'border-brand-red text-brand-red'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-3 sm:py-4 px-1 sm:px-2 border-b-2 font-medium text-xs sm:text-sm flex-1 sm:flex-none`}
                        >
                            Gerenciar
                        </button>
                         <button
                            onClick={() => setActiveTab('single')}
                            className={`${
                                activeTab === 'single'
                                ? 'border-brand-red text-brand-red'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-3 sm:py-4 px-1 sm:px-2 border-b-2 font-medium text-xs sm:text-sm flex-1 sm:flex-none`}
                        >
                            Cadastrar Sócio
                        </button>
                        <button
                           onClick={() => setActiveTab('bulk')}
                           className={`${
                                activeTab === 'bulk'
                                ? 'border-brand-red text-brand-red'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-3 sm:py-4 px-1 sm:px-2 border-b-2 font-medium text-xs sm:text-sm flex-1 sm:flex-none`}
                        >
                           Em Massa
                        </button>
                    </nav>
                </div>

                <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-[500px]">
                   {activeTab === 'manage' && (
                        <UserManagement 
                            users={users}
                            onToggleBlock={onToggleBlock}
                            onToggleRole={onToggleRole}
                            currentUser={currentUser}
                            onEditUser={onEditUser}
                            onDeleteUser={onDeleteUser}
                            onResetPassword={onResetPassword}
                        />
                   )}
                   {activeTab === 'single' && (
                        <AddSingleUser onSingleRegister={onSingleRegister} />
                   )}
                   {activeTab === 'bulk' && (
                        <BulkUserRegistration onBulkRegister={onBulkRegister} />
                   )}
                </div>
                <div className="flex justify-end p-4 bg-gray-50 rounded-b-lg flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-brand-dark border border-transparent rounded-md text-sm font-medium text-white hover:bg-gray-700"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};