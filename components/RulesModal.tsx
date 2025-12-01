import React from 'react';
import { XMarkIcon } from './IconComponents';

interface RulesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-label="Regras de Agendamento">
            <div className="bg-white rounded-t-3xl rounded-b-xl shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-2xl font-bold text-brand-dark">Regras de Agendamento</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-red rounded" aria-label="Fechar modal">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-6 prose max-w-none overflow-y-auto flex-1">
                    <h4>Funcionamento e Liberação de Horários</h4>
                    <ul>
                        <li>O clube <strong>não abre às segundas-feiras</strong> para manutenção.</li>
                        <li>
                            <strong>Dias de Semana (Terça a Sexta):</strong> A liberação para agendamentos ocorre toda <strong>segunda-feira, às 09:00</strong> da manhã.
                        </li>
                        <li>
                            <strong>Fim de Semana (Sábado e Domingo):</strong> A liberação para agendamentos ocorre toda <strong>quinta-feira, às 10:00</strong> da manhã.
                        </li>
                         <li>
                            <strong>Semanas Futuras:</strong> Sócios podem agendar jogos <strong>apenas para a semana corrente</strong>.
                        </li>
                    </ul>
                    
                     <h4>Regras e Limites de Agendamento por Sócio (CPF)</h4>
                    <ul>
                        <li>
                            <strong>Limite Diário por Tipo de Quadra:</strong> Cada sócio pode agendar ou participar de:
                            <ul className="not-prose list-disc list-inside ml-4 my-2 text-base">
                                <li><strong>1 (um) jogo de tênis por dia</strong>.</li>
                                <li><strong>1 (um) jogo em quadra de areia por dia</strong>.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Agendamentos de Última Hora:</strong> Jogos agendados com <strong>menos de 2 horas de antecedência</strong> não contam para os limites de jogos.
                        </li>
                        <li>Os limites são contabilizados por CPF, seja como titular da reserva ou como adversário (para jogos de tênis).</li>
                        <li>Um sócio que já atingiu seu limite para um tipo de quadra não aparecerá como adversário disponível para aquele tipo.</li>
                    </ul>

                    <h4>Regras para Professores e Administradores</h4>
                     <ul>
                        <li>
                            <strong>Jogos Pessoais:</strong> Para agendar jogos (Normal, Pirâmide, etc.), professores e administradores estão sujeitos aos <strong>mesmos limites de jogos e regras de liberação de horários</strong> que os demais sócios.
                        </li>
                        <li>
                            Em horários que ainda não foram liberados para sócios (semanas futuras ou antes do horário de liberação), as seguintes ações são permitidas:
                            <ul>
                                <li><strong>Professores:</strong> Podem agendar apenas <strong>'Aulas'</strong>.</li>
                                <li><strong>Administradores:</strong> Podem apenas <strong>'Interditar'</strong> quadras.</li>
                            </ul>
                        </li>
                        <li>As atividades de aula e interdição não contam para os limites de jogos pessoais.</li>
                    </ul>
                </div>
                <div className="flex justify-end p-4 bg-gray-50 rounded-b-xl sticky bottom-0">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-brand-dark border border-transparent rounded-md text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-red"
                    >
                        Entendi
                    </button>
                </div>
            </div>
        </div>
    );
};