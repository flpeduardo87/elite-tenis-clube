import React from 'react';
import { XMarkIcon } from './IconComponents';
import type { User } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, currentUser }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 pb-28">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[calc(100vh-14rem)]">
        <div className="flex justify-between items-center p-4 border-b flex-shrink-0">
          <h2 className="text-xl font-bold text-brand-dark">Meu Perfil</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-4 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 18rem)' }}>
          {/* Avatar */}
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-brand-primary to-rose-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
              {currentUser.first_name.charAt(0).toUpperCase()}{currentUser.last_name.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Informações do Usuário */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Nome Completo
              </label>
              <p className="text-sm font-medium text-gray-900">
                {currentUser.first_name} {currentUser.last_name}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                CPF
              </label>
              <p className="text-sm font-medium text-gray-900">
                {currentUser.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Telefone
              </label>
              <p className="text-sm font-medium text-gray-900">
                {currentUser.phone ? currentUser.phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3') : 'Não informado'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Função
              </label>
              <div className="flex flex-wrap gap-2">
                {currentUser.roles.map(role => {
                  const roleNames = {
                    member: 'Sócio',
                    teacher: 'Professor',
                    admin: 'Administrador'
                  };
                  const roleColors = {
                    member: 'bg-blue-100 text-blue-800',
                    teacher: 'bg-purple-100 text-purple-800',
                    admin: 'bg-red-100 text-red-800'
                  };
                  return (
                    <span
                      key={role}
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${roleColors[role as keyof typeof roleColors]}`}
                    >
                      {roleNames[role as keyof typeof roleNames]}
                    </span>
                  );
                })}
              </div>
            </div>

            {currentUser.is_blocked && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-xs text-red-700 font-medium">
                  ⚠️ Sua conta está bloqueada. Entre em contato com a administração.
                </p>
              </div>
            )}
          </div>
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
