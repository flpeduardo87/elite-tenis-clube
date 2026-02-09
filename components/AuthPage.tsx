import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { isValidCPF } from '../src/utils';

export const AuthPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState<'login' | 'register'>('login');
    
    // Campos de login
    const [cpf, setCpf] = useState('');
    const [password, setPassword] = useState('');
    
    // Campos de cadastro
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
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
        setSuccessMessage('');
        setIsLoading(true);
    
        const cpfNumbers = cpf.replace(/\D/g, '');
        
        if (!isValidCPF(cpfNumbers)) {
            setError('CPF inválido.');
            setIsLoading(false);
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
        
        setIsLoading(false);
    };
    
    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);
    
        const cpfNumbers = cpf.replace(/\D/g, '');
        const phoneNumbers = phone.replace(/\D/g, '');
        
        // Validações
        if (!isValidCPF(cpfNumbers)) {
            setError('CPF inválido.');
            setIsLoading(false);
            return;
        }
        
        if (firstName.trim().length < 2) {
            setError('Nome deve ter pelo menos 2 caracteres.');
            setIsLoading(false);
            return;
        }

        if (lastName.trim().length < 2) {
            setError('Sobrenome deve ter pelo menos 2 caracteres.');
            setIsLoading(false);
            return;
        }
        
        if (phoneNumbers.length < 10) {
            setError('Telefone inválido.');
            setIsLoading(false);
            return;
        }
        
        if (registerPassword.length < 6) {
            setError('Senha deve ter pelo menos 6 caracteres.');
            setIsLoading(false);
            return;
        }
        
        if (registerPassword !== confirmPassword) {
            setError('As senhas não coincidem.');
            setIsLoading(false);
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
                setIsLoading(false);
                return;
            }
            
            const email = `cpf${cpfNumbers}@elitetenis.com.br`;
            
            // Criar usuário no Supabase Auth
            const { data: authData, error: signUpError } = await supabase.auth.signUp({
                email: email,
                password: registerPassword,
                options: {
                    data: {
                        cpf: cpfNumbers,
                        first_name: firstName.trim(),
                        last_name: lastName.trim(),
                        phone: phoneNumbers
                    }
                }
            });
            
            if (signUpError) {
                setError('Erro ao criar conta: ' + signUpError.message);
                setIsLoading(false);
                return;
            }
            
            if (!authData.user) {
                setError('Erro ao criar usuário.');
                setIsLoading(false);
                return;
            }
            
            // Aguardar um pouco para o trigger criar o perfil
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Atualizar/garantir perfil com dados corretos (caso o trigger não tenha funcionado)
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: authData.user.id,
                    cpf: cpfNumbers,
                    first_name: firstName.trim(),
                    last_name: lastName.trim(),
                    phone: phoneNumbers,
                    roles: ['member'],
                    is_blocked: false
                }, {
                    onConflict: 'id'
                });
            
            if (profileError) {
                setError('Erro ao criar perfil: ' + profileError.message);
                setIsLoading(false);
                return;
            }
            
            setSuccessMessage('Cadastro realizado com sucesso! Você será conectado automaticamente.');
            
            // Auto-login
            setTimeout(async () => {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: registerPassword,
                });
                
                if (signInError) {
                    setError('Cadastro realizado, mas erro ao fazer login. Tente fazer login manualmente.');
                }
            }, 1500);
            
        } catch (err: any) {
            setError('Erro inesperado: ' + err.message);
        }
        
        setIsLoading(false);
    };

    const switchMode = () => {
        setMode(mode === 'login' ? 'register' : 'login');
        setError('');
        setSuccessMessage('');
        setCpf('');
        setPassword('');
        setFirstName('');
        setLastName('');
        setPhone('');
        setRegisterPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-4 overflow-hidden">
            {/* Left Side - Brand (Desktop Only) */}
            <div className="hidden lg:flex w-1/2 flex-col items-center justify-center pr-8">
                <div className="max-w-sm text-center">
                    <div className="mb-6">
                        <img 
                            src="/logo-elite.png" 
                            alt="Canoinhas Tênis Clube" 
                            className="w-28 h-28 object-contain mx-auto drop-shadow-lg"
                        />
                    </div>
                    <h1 className="text-5xl font-bold text-gray-800 mb-2">
                        Canoinhas
                    </h1>
                    <p className="text-xl text-gray-600 mb-4 font-semibold">
                        Tênis Clube
                    </p>
                    <p className="text-sm text-gray-500 mb-8">
                        Sistema de Reserva de Quadras
                    </p>
                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
                        <p className="text-gray-700 text-sm leading-relaxed">
                            Gerencie suas reservas de quadras de forma simples e eficiente. Acesse a plataforma com seu CPF e senha.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center">
                <div className="w-full max-w-sm">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-7">
                        <img 
                            src="/logo-elite.png" 
                            alt="Canoinhas Tênis Clube" 
                            className="w-16 h-16 object-contain mx-auto mb-3"
                        />
                        <h1 className="text-2xl font-bold text-gray-800">Canoinhas</h1>
                        <p className="text-gray-600 text-sm">Tênis Clube</p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
                        {/* Header */}
                        <div className="mb-7">
                            <h2 className="text-[22px] lg:text-3xl font-bold text-gray-800 mb-2">
                                {mode === 'login' ? 'Bem-vindo de volta' : 'Criar Conta'}
                            </h2>
                            <p className="text-sm text-gray-600">
                                {mode === 'login' 
                                    ? 'Acesse sua conta com CPF e senha' 
                                    : 'Preencha os dados para se cadastrar'}
                            </p>
                        </div>

                        {/* Messages */}
                        {error && (
                            <div className="mb-5 p-4 bg-red-50 border border-red-300 rounded-xl">
                                <p className="text-sm text-red-700 font-medium">{error}</p>
                            </div>
                        )}
                        
                        {successMessage && (
                            <div className="mb-5 p-4 bg-green-50 border border-green-300 rounded-xl">
                                <p className="text-sm text-green-700 font-medium">{successMessage}</p>
                            </div>
                        )}

                        {/* Login Form */}
                        {mode === 'login' && (
                            <form onSubmit={handleLogin} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        CPF
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="XXX.XXX.XXX-XX"
                                        value={cpf}
                                        onChange={(e) => setCpf(formatCPF(e.target.value))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-gray-50"
                                        disabled={isLoading}
                                        autoComplete="off"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Senha
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Sua senha segura"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-gray-50"
                                        disabled={isLoading}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-xl transition duration-200 shadow-md hover:shadow-lg text-base"
                                >
                                    {isLoading ? 'Entrando...' : 'Entrar na Conta'}
                                </button>
                            </form>
                        )}

                        {/* Register Form */}
                        {mode === 'register' && (
                            <form onSubmit={handleRegister} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Nome
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Seu nome"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-gray-50"
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Sobrenome
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Seu sobrenome"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-gray-50"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        CPF
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="XXX.XXX.XXX-XX"
                                        value={cpf}
                                        onChange={(e) => setCpf(formatCPF(e.target.value))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-gray-50"
                                        disabled={isLoading}
                                        autoComplete="off"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Telefone
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="(XX) 9XXXX-XXXX"
                                        value={phone}
                                        onChange={(e) => setPhone(formatPhone(e.target.value))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-gray-50"
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Senha
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Mínimo 6 caracteres"
                                        value={registerPassword}
                                        onChange={(e) => setRegisterPassword(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-gray-50"
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Confirmar Senha
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Digite a senha novamente"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-gray-50"
                                        disabled={isLoading}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-xl transition duration-200 shadow-md hover:shadow-lg text-base"
                                >
                                    {isLoading ? 'Criando Conta...' : 'Criar Minha Conta'}
                                </button>
                            </form>
                        )}

                        {/* Switch Mode */}
                        <div className="mt-6 text-center border-t border-gray-200 pt-6">
                            <button
                                onClick={switchMode}
                                disabled={isLoading}
                                className="text-emerald-600 hover:text-emerald-700 disabled:text-gray-400 font-semibold text-sm transition"
                            >
                                {mode === 'login' 
                                    ? 'Não tem conta? Cadastre-se' 
                                    : 'Já tem conta? Faça login'}
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-xs text-gray-500 mt-6">
                        © 2025 Canoinhas Tênis Clube • Sistema v1.0
                    </p>
                </div>
            </div>
        </div>
    );
};
