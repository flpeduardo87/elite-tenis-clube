import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export const AuthPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [cpf, setCpf] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const formatCPF = (value: string) => {
      return value
          .replace(/\D/g, '')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})/, '$1-$2')
          .substring(0, 14);
    };

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        setLoading(true);
    
        const cpfNumbers = cpf.replace(/\D/g, '');
        // Formato de e-mail padronizado, usado tanto para cadastro quanto para login.
        const email = `cpf${cpfNumbers}@elitetenis.com.br`;
    
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
    
        if (signInError) {
            setError('CPF ou senha inválidos. Verifique os dados e tente novamente.');
        }
        
        setLoading(false);
    };
    
    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCpf(formatCPF(e.target.value));
    };


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-brand-bg p-4">
            <div className="w-full max-w-md">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold tracking-tight text-brand-dark sm:text-5xl">
                       Elite Tênis Clube
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Bem-vindo ao sistema de agendamento de quadras.
                    </p>
                </header>

                <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
                                CPF
                            </label>
                            <div className="mt-1">
                                <input
                                    id="cpf"
                                    name="cpf"
                                    type="text"
                                    value={cpf}
                                    onChange={handleCpfChange}
                                    placeholder="000.000.000-00"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-red focus:border-brand-red sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Senha
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-red focus:border-brand-red sm:text-sm"
                                />
                            </div>
                        </div>

                        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-red hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red disabled:bg-gray-400"
                            >
                                {loading ? 'Entrando...' : 'Entrar'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                      <p>O acesso é exclusivo para sócios. O cadastro é realizado pela administração do clube.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};