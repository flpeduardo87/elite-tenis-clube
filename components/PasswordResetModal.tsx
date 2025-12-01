import React, { useState, useMemo } from 'react';
import { XMarkIcon } from './IconComponents';

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newPassword: string) => Promise<{ success: boolean; error?: string }>; // returns result
}

export const PasswordResetModal: React.FC<PasswordResetModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [pwd1, setPwd1] = useState('');
  const [pwd2, setPwd2] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const passwordChecks = useMemo(() => {
    return {
      length: pwd1.length >= 10,
      upper: /[A-Z]/.test(pwd1),
      lower: /[a-z]/.test(pwd1),
      number: /\d/.test(pwd1),
      symbol: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd1)
    };
  }, [pwd1]);
  const allOk = Object.values(passwordChecks).every(Boolean);
  const canConfirm = allOk && pwd1 === pwd2;

  const handleConfirm = async () => {
    setError(null);
    setIsSubmitting(true);
    const res = await onConfirm(pwd1);
    setIsSubmitting(false);
    if (res.success) {
      onClose();
    } else if (res.error) {
      setError(res.error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-brand-dark">Definir Nova Senha</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XMarkIcon className="h-6 w-6" /></button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">Por segurança, é necessário definir uma nova senha.</p>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nova senha</label>
            <input type="password" value={pwd1} onChange={e => setPwd1(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" placeholder="Mínimo 10 caracteres" />
            <ul className="mt-2 text-xs space-y-1">
              <li className={passwordChecks.length ? 'text-green-600' : 'text-gray-500'}>• 10+ caracteres</li>
              <li className={passwordChecks.upper ? 'text-green-600' : 'text-gray-500'}>• 1 letra maiúscula</li>
              <li className={passwordChecks.lower ? 'text-green-600' : 'text-gray-500'}>• 1 letra minúscula</li>
              <li className={passwordChecks.number ? 'text-green-600' : 'text-gray-500'}>• 1 número</li>
              <li className={passwordChecks.symbol ? 'text-green-600' : 'text-gray-500'}>• 1 símbolo</li>
            </ul>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmar senha</label>
            <input type="password" value={pwd2} onChange={e => setPwd2(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
          </div>
          {error && <div className="text-sm text-red-700 bg-red-100 border border-red-200 p-2 rounded">{error}</div>}
        </div>
        <div className="flex justify-end p-4 bg-gray-50 rounded-b-lg">
          <button onClick={onClose} className="px-4 py-2 mr-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
          <button onClick={handleConfirm} disabled={!canConfirm || isSubmitting} className="px-4 py-2 bg-brand-red border border-transparent rounded-md text-sm font-medium text-white hover:bg-rose-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
};
