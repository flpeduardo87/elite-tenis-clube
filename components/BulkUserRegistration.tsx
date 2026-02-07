
import React, { useState } from 'react';
import { UserPlusIcon } from './IconComponents';

interface BulkUserRegistrationProps {
    onBulkRegister: (userData: string) => Promise<{ success: number; failed: number; errors: string[]; credentials: { cpf: string; password: string }[] }>;
}

export const BulkUserRegistration: React.FC<BulkUserRegistrationProps> = ({ onBulkRegister }) => {
    const [userData, setUserData] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ success: number; failed: number; errors: string[]; credentials: { cpf: string; password: string }[] } | null>(null);

    const handleSubmit = async () => {
        if (!userData.trim()) {
            alert('Por favor, insira os dados dos sócios.');
            return;
        }
        setIsLoading(true);
        setResult(null);
        const res = await onBulkRegister(userData);
        setResult(res);
        setIsLoading(false);
        setUserData(''); // Clear textarea after submission
    };

    return (
        <div>
            <h3 className="text-base font-medium text-gray-900 mb-1">Cadastrar Múltiplos Sócios</h3>
            <p className="text-xs text-gray-600 mb-2">
                Cole a lista de novos sócios no campo abaixo. Cada sócio deve estar em uma nova linha, com os dados separados por ponto e vírgula.
            </p>
            <div className="bg-gray-100 p-1.5 rounded-md mb-2">
                <p className="text-xs font-mono text-gray-700">
                    <strong>Formato:</strong> CPF;Nome;Sobrenome<br />
                    <strong>Exemplo:</strong> 123.456.789-00;Joao;Silva
                </p>
            </div>
            
            <textarea
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-red focus:border-brand-red"
                placeholder="111.222.333-44;Maria;Souza&#10;999.888.777-66;Carlos;Pereira"
                value={userData}
                onChange={(e) => setUserData(e.target.value)}
                disabled={isLoading}
            />

            <div className="mt-2 text-center">
                 <p className="text-xs text-gray-500 mb-1.5">Uma senha temporária forte será gerada para cada sócio.</p>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-red hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red disabled:bg-gray-400"
                >
                    <UserPlusIcon className="-ml-1 mr-2 h-4 w-4" />
                    {isLoading ? 'Cadastrando...' : 'Cadastrar Sócios'}
                </button>
            </div>

            {result && (
                <div className="mt-6 p-4 border rounded-md bg-gray-50">
                    <h4 className="text-md font-semibold text-gray-800">Resultado do Cadastro</h4>
                    <p className="text-sm text-green-600"><strong>Sucesso:</strong> {result.success} sócios cadastrados.</p>
                    <p className="text-sm text-red-600"><strong>Falhas:</strong> {result.failed} cadastros falharam.</p>
                    {result.credentials.length > 0 && (
                        <div className="mt-3">
                            <h5 className="text-sm font-semibold text-gray-700">Credenciais Geradas (compartilhe com os sócios):</h5>
                            <ul className="list-disc list-inside text-xs text-gray-700 max-h-40 overflow-y-auto bg-white border p-2 rounded">
                                {result.credentials.map((c) => (
                                    <li key={c.cpf}><strong>{c.cpf}</strong> — senha: {c.password}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {result.errors.length > 0 && (
                        <div className="mt-2">
                            <h5 className="text-sm font-semibold text-gray-700">Detalhes dos Erros:</h5>
                            <ul className="list-disc list-inside text-xs text-gray-600 max-h-32 overflow-y-auto">
                                {result.errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
