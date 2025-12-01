
import React, { useState } from 'react';
import { UserPlusIcon } from './IconComponents';
import { isValidCPF, formatCPF } from '../src/utils';

const maskCPF = (value: string) => formatCPF(value);

interface AddSingleUserProps {
    onSingleRegister: (details: { cpf: string; firstName: string; lastName: string }) => Promise<{ success: boolean; error?: string; tempPassword?: string }>;
}

export const AddSingleUser: React.FC<AddSingleUserProps> = ({ onSingleRegister }) => {
    const [cpf, setCpf] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCpf(maskCPF(e.target.value));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setResult(null);

        if (!cpf || !firstName || !lastName) {
            setResult({ success: false, message: 'Todos os campos são obrigatórios.' });
            return;
        }
           if (!isValidCPF(cpf)) {
               setResult({ success: false, message: 'CPF inválido. Verifique os dígitos.' });
            return;
        }

        setIsLoading(true);
        const res = await onSingleRegister({ cpf, firstName, lastName });

        if (res.success) {
            setResult({ success: true, message: `Sócio cadastrado com sucesso! Senha temporária: ${res.tempPassword}. Peça para alterar no primeiro login.` });
            setCpf('');
            setFirstName('');
            setLastName('');
        } else {
            setResult({ success: false, message: res.error || 'Ocorreu um erro desconhecido.' });
        }
        setIsLoading(false);
    };

    return (
        <div className="max-w-lg mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Cadastrar Novo Sócio</h3>
            <p className="text-sm text-gray-600 mb-4">
                Preencha os dados abaixo para adicionar um novo sócio ao clube.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label htmlFor="cpf-single" className="block text-sm font-medium text-gray-700">CPF</label>
                    <input
                        type="text"
                        id="cpf-single"
                        value={cpf}
                        onChange={handleCpfChange}
                        placeholder="000.000.000-00"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red sm:text-sm"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="firstName-single" className="block text-sm font-medium text-gray-700">Nome</label>
                    <input
                        type="text"
                        id="firstName-single"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red sm:text-sm"
                        required
                    />
                </div>
                 <div>
                    <label htmlFor="lastName-single" className="block text-sm font-medium text-gray-700">Sobrenome</label>
                    <input
                        type="text"
                        id="lastName-single"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red sm:text-sm"
                        required
                    />
                </div>

                 <div className="text-center pt-2">
                    <p className="text-sm text-gray-500 mb-4">Uma senha temporária forte será gerada automaticamente.</p>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-red hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red disabled:bg-gray-400"
                    >
                        <UserPlusIcon className="-ml-1 mr-2 h-5 w-5" />
                        {isLoading ? 'Cadastrando...' : 'Cadastrar Sócio'}
                    </button>
                </div>
            </form>

             {result && (
                <div className={`mt-4 text-center text-sm p-3 rounded-md ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {result.message}
                </div>
            )}
        </div>
    );
};
