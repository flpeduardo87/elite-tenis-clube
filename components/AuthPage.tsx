import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { isValidCPF } from '../src/utils';

export const AuthPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'login' | 'register'>('login');
    
    // Campos de login
    const [cpf, setCpf] = useState('');
    const [password, setPassword] = useState('');
    
    // Campos adicionais de cadastro
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const formatCPF = (value: string) => {
      return value
          .replace(/\D/g, '')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})/, '$1-$2')
          .substring(0, 14);
    };

    const formatPhone = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .substring(0, 15);
    };

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
    
        const cpfNumbers = cpf.replace(/\D/g, '');
        
        if (!isValidCPF(cpfNumbers)) {
            setError('CPF inválido.');
            setLoading(false);
            return;
        }
        
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
    
    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
    
        const cpfNumbers = cpf.replace(/\D/g, '');
        const phoneNumbers = phone.replace(/\D/g, '');
        
        // Validações
        if (!isValidCPF(cpfNumbers)) {
            setError('CPF inválido.');
            setLoading(false);
            return;
        }
        
        if (name.trim().length < 3) {
            setError('Nome deve ter pelo menos 3 caracteres.');
            setLoading(false);
            return;
        }
        
        if (phoneNumbers.length < 10) {
            setError('Telefone inválido.');
            setLoading(false);
            return;
        }
        
        if (password.length < 6) {
            setError('Senha deve ter pelo menos 6 caracteres.');
            setLoading(false);
            return;
        }
        
        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            setLoading(false);
            return;
        }
        
        try {
            // Verificar se CPF já existe
            const { data: existingProfile } = await supabase
                .from('profiles')
                .select('cpf')
                .eq('cpf', cpfNumbers)
                .single();
            
            if (existingProfile) {
                setError('CPF já cadastrado. Faça login ou recupere sua senha.');
                setLoading(false);
                return;
            }
            
            const email = `cpf${cpfNumbers}@elitetenis.com.br`;
            
            // Criar usuário no Supabase Auth
            const { data: authData, error: signUpError } = await supabase.auth.signUp({
                email: email,
                password: password,
            });
            
            if (signUpError) {
                setError('Erro ao criar conta: ' + signUpError.message);
                setLoading(false);
                return;
            }
            
            if (!authData.user) {
                setError('Erro ao criar usuário.');
                setLoading(false);
                return;
            }
            
            // Criar perfil
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: authData.user.id,
                    cpf: cpfNumbers,
                    name: name.trim(),
                    phone: phoneNumbers,
                    roles: ['member'],
                    is_blocked: false,
                    must_reset_password: false
                });
            
            if (profileError) {
                setError('Erro ao criar perfil: ' + profileError.message);
                setLoading(false);
                return;
            }
            
            setSuccess('Cadastro realizado com sucesso! Você será conectado automaticamente.');
            
            // Auto-login
            setTimeout(async () => {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password,
                });
                
                if (signInError) {
                    setError('Cadastro realizado, mas erro ao fazer login. Tente fazer login manualmente.');
                }
            }, 1500);
            
        } catch (err: any) {
            setError('Erro inesperado: ' + err.message);
        }
        
        setLoading(false);
    };
    
    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCpf(formatCPF(e.target.value));
    };
    
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(formatPhone(e.target.value));
    };
    
    const switchMode = () => {
        setMode(mode === 'login' ? 'register' : 'login');
        setError('');
        setSuccess('');
    };


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-emerald-600 p-4">
            <div className="w-full max-w-md">
                <header className="text-center mb-8">
                    <div className="mb-3 flex justify-center">
                        <div className="bg-white p-2 rounded-xl shadow-lg">
                            <img 
                                src="/logo-elite.png" 
                                alt="Canoinhas Tênis Clube" 
                                className="w-14 h-14 object-contain"
                            />
                        </div>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-white drop-shadow-lg">
                       Canoinhas Tênis Clube
                    </h1>
                    <p className="mt-1.5 text-xs text-emerald-50 font-medium">
                        {mode === 'login' ? 'Entre com sua conta' : 'Crie sua conta'}
                    </p>
                </header>

                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                    {mode === 'login' ? (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label htmlFor="cpf" className="block text-xs font-semibold text-gray-700 mb-1">
                                    CPF
                                </label>
                                <input
                                    id="cpf"
                                    name="cpf"
                                    type="text"
                                    value={cpf}
                                    onChange={handleCpfChange}
                                    placeholder="000.000.000-00"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-sm transition-all"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-1">
                                    Senha
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Digite sua senha"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-sm transition-all"
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                    {error}
                                </div>
                            )}
                            
                            {success && (
                                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                                    {success}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-brand-primary to-rose-600 hover:from-brand-primary hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {loading ? 'Entrando...' : 'Entrar'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister} className="space-y-3">
                            <div>
                                <label htmlFor="register-name" className="block text-xs font-semibold text-gray-700 mb-1">
                                    Nome Completo
                                </label>
                                <input
                                    id="register-name"
                                    name="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Seu nome completo"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-sm transition-all"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="register-cpf" className="block text-xs font-semibold text-gray-700 mb-1">
                                    CPF
                                </label>
                                <input
                                    id="register-cpf"
                                    name="cpf"
                                    type="text"
                                    value={cpf}
                                    onChange={handleCpfChange}
                                    placeholder="000.000.000-00"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-sm transition-all"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="register-phone" className="block text-xs font-semibold text-gray-700 mb-1">
                                    Telefone
                                </label>
                                <input
                                    id="register-phone"
                                    name="phone"
                                    type="text"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    placeholder="(00) 00000-0000"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-sm transition-all"
                                />
                            </div>

                            <div>
                                <label htmlFor="register-password" className="block text-xs font-semibold text-gray-700 mb-1">
                                    Senha
                                </label>
                                <input
                                    id="register-password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Mínimo 6 caracteres"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-sm transition-all"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="register-confirm-password" className="block text-xs font-semibold text-gray-700 mb-1">
                                    Confirmar Senha
                                </label>
                                <input
                                    id="register-confirm-password"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Digite a senha novamente"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-sm transition-all"
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                    {error}
                                </div>
                            )}
                            
                            {success && (
                                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                                    {success}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-brand-primary to-rose-600 hover:from-brand-primary hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {loading ? 'Criando conta...' : 'Criar conta'}
                            </button>
                        </form>
                    )}

                    <div className="mt-4 text-center">
                        <button
                            onClick={switchMode}
                            disabled={loading}
                            className="text-sm font-medium text-brand-primary hover:text-emerald-700 transition-colors disabled:opacity-50"
                        >
                            {mode === 'login' ? (
                                <>Não tem conta? <span className="underline">Cadastre-se aqui</span></>
                            ) : (
                                <>Já tem conta? <span className="underline">Faça login</span></>
                            )}
                        </button>
                    </div>
                </div>
                
                <div className="mt-6 text-center text-xs text-emerald-50/80">
                    <p>Sistema de Reserva de Quadras v1.0</p>
                </div>
            </div>
        </div>
    );
};