import { MASTER_ADMIN_CPF } from '../constants';
import type { User } from '../types';

/**
 * Normalizes a CPF string by removing all non-digit characters.
 * @param cpf The CPF string to normalize.
 * @returns A string containing only the digits of the CPF.
 */
export const normalizeCpf = (cpf: string): string => (cpf || '').replace(/\D/g, '');

/**
 * Checks if the given user is the designated Master Admin.
 * The check is based on comparing the normalized CPF against a hardcoded constant.
 * This is the single source of truth for identifying the Master Admin.
 * @param user The user object to check.
 * @returns True if the user is the Master Admin, false otherwise.
 */
export const isMasterAdmin = (user: User | null): boolean => {
    if (!user) {
        return false;
    }
    return normalizeCpf(user.cpf) === normalizeCpf(MASTER_ADMIN_CPF);
};

/**
 * Valida formato de CPF (com ou sem máscara)
 */
export const isValidCPF = (cpf: string): boolean => {
  const cleanCPF = normalizeCpf(cpf);
  
  if (cleanCPF.length !== 11) return false;
  
  // CPFs inválidos conhecidos (todos iguais)
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  // Validação do dígito verificador
  let sum = 0;
  let remainder;
  
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;
  
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;
  
  return true;
};

/**
 * Formata CPF para exibição (000.000.000-00)
 */
export const formatCPF = (cpf: string): string => {
  const clean = normalizeCpf(cpf);
  return clean
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .substring(0, 14);
};

/**
 * Trata erros do Supabase de forma amigável
 */
export const handleSupabaseError = (error: any): string => {
  if (!error) return 'Erro desconhecido';
  
  const message = error.message || error.toString();
  
  // Mapeamento de erros comuns
  const errorMap: Record<string, string> = {
    'Invalid login credentials': 'CPF ou senha incorretos',
    'Email not confirmed': 'Email não confirmado',
    'User already registered': 'Usuário já cadastrado',
    'JWT expired': 'Sessão expirada. Faça login novamente',
    'Network request failed': 'Erro de conexão. Verifique sua internet',
    'duplicate key value': 'Este horário já está reservado',
    'violates row-level security policy': 'Você não tem permissão para esta ação',
  };
  
  for (const [key, value] of Object.entries(errorMap)) {
    if (message.includes(key)) return value;
  }
  
  return `Erro: ${message}`;
};

/**
 * Verifica se está em modo de desenvolvimento
 */
export const isDevelopment = (): boolean => {
  return import.meta.env.DEV;
};

/**
 * Log condicional (apenas em desenvolvimento)
 */
export const devLog = (...args: any[]): void => {
  if (isDevelopment()) {
    console.log('[DEV]', ...args);
  }
};

/**
 * Detecta se está em dispositivo móvel
 */
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Gera uma senha temporária forte com letras, números e símbolos.
 */
export const generateTempPassword = (length = 14): string => {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnopqrstuvwxyz';
  const numbers = '23456789';
  const symbols = '!@#$%';
  const all = upper + lower + numbers + symbols;

  const pick = (set: string) => set[Math.floor(Math.random() * set.length)];

  // Garantir complexidade mínima
  let pwd = pick(upper) + pick(lower) + pick(numbers) + pick(symbols);
  for (let i = pwd.length; i < length; i++) {
    pwd += pick(all);
  }
  // Embaralhar
  return pwd
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
};
