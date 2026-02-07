
import React, { useState } from 'react';
import { UserPlusIcon } from './IconComponents';
import { isValidCPF, formatCPF } from '../src/utils';

const maskCPF = (value: string) => formatCPF(value);
const maskPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
        return numbers.replace(/(\d{2})(\d{0,4})(\d{0,4})/, (_, p1, p2, p3) => {
            let result = p1;
            if (p2) result += ` ${p2}`;
            if (p3) result += `-${p3}`;
            return result;
        });
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, (_, p1, p2, p3) => {
        let result = p1;
        if (p2) result += ` ${p2}`;
        if (p3) result += `-${p3}`;
        return result;
    });
};

interface AddSingleUserProps {
    onSingleRegister: (details: { cpf: string; firstName: string; lastName: string; phone?: string }) => Promise<{ success: boolean; error?: string; tempPassword?: string }>;
}

export const AddSingleUser: React.FC<AddSingleUserProps> = ({ onSingleRegister }) => {
    const [cpf, setCpf] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCpf(maskCPF(e.target.value));
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(maskPhone(e.target.value));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setResult(null);

        if (!cpf || !fullName.trim()) {
            setResult({ success: false, message: 'CPF e Nome Completo são obrigatórios.' });
            return;
        }
        if (!isValidCPF(cpf)) {
            setResult({ success: false, message: 'CPF inválido. Verifique os dígitos.' });
            return;
        }

        const nameParts = fullName.trim().split(/\s+/);
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || nameParts[0];

        setIsLoading(true);
        const res = await onSingleRegister({ cpf, firstName, lastName, phone: phone.replace(/\D/g, '') || undefined });

        if (res.success) {
            setResult({ success: true, message: `Sócio cadastrado! Senha temporária: ${res.tempPassword}` });
            setCpf('');
            setFullName('');
            setPhone('');
        } else {
            setResult({ success: false, message: res.error || 'Erro desconhecido.' });
        }
        setIsLoading(false);
    };

    return (
        <div>
            <h3 className="text-base font-medium text-gray-900 mb-1">Cadastrar Novo Sócio</h3>
            <p className="text-xs text-gray-600 mb-3">
                Preencha os dados abaixo.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label htmlFor="cpf-single" className="block text-xs font-medium text-gray-700 mb-1">CPF</label>
                    <input
                        type="text"
                        id="cpf-single"
                        value={cpf}
                        onChange={handleCpfChange}
                        placeholder="000.000.000-00"
                        className="block w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-brand-red focus:border-brand-red"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="fullName-single" className="block text-xs font-medium text-gray-700 mb-1">Nome Completo</label>
                    <input
                        type="text"
                        id="fullName-single"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="João da Silva"
                        className="block w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-brand-red focus:border-brand-red"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="phone-single" className="block text-xs font-medium text-gray-700 mb-1">Telefone (opcional)</label>
                    <input
                        type="text"
                        id="phone-single"
                        value={phone}
                        onChange={handlePhoneChange}
                        placeholder="11 98765-4321"
                        className="block w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-brand-red focus:border-brand-red"
                    />
                </div>

                <div className="pt-2 text-center">
                    <p className="text-xs text-gray-500 mb-2">Senha temporária será gerada automaticamente.</p>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-red hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red disabled:bg-gray-400"
                    >
                        <UserPlusIcon className="-ml-1 mr-2 h-4 w-4" />
                        {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                    </button>
                </div>
            </form>

            {result && (
                <div className={`mt-3 text-xs p-2 rounded ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {result.message}
                </div>
            )}
        </div>
    );
};
