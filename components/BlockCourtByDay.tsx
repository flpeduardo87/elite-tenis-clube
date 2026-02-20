import React, { useState } from 'react';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { TENNIS_COURTS, SAND_COURTS, WEEKDAY_TIME_SLOTS, WEEKEND_TIME_SLOTS } from '../constants';

interface BlockCourtByDayProps {
    onBlockCourt: (courtId: number, date: Date) => Promise<{ success: boolean; error?: string }>;
    onUnblockCourt: (courtId: number, date: Date) => Promise<{ success: boolean; error?: string }>;
}

export const BlockCourtByDay: React.FC<BlockCourtByDayProps> = ({ onBlockCourt, onUnblockCourt }) => {
    const [selectedCourt, setSelectedCourt] = useState<number>(1);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

    // Estado para remoção de interdição
    const [unblockCourt, setUnblockCourt] = useState<number>(1);
    const [unblockStartDate, setUnblockStartDate] = useState<string>('');
    const [unblockEndDate, setUnblockEndDate] = useState<string>('');
    const [isUnblocking, setIsUnblocking] = useState(false);
    const [unblockResult, setUnblockResult] = useState<{ success: boolean; message: string } | null>(null);

    const allCourts = [...TENNIS_COURTS, ...SAND_COURTS];
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!startDate) {
            setResult({ success: false, message: 'Selecione a data de início' });
            return;
        }

        setIsSubmitting(true);
        setResult(null);

        const start = new Date(startDate + 'T00:00:00');
        const end = endDate ? new Date(endDate + 'T00:00:00') : start;
        
        // Validar que a data final não é anterior à inicial
        if (end < start) {
            setResult({ success: false, message: 'Data final não pode ser anterior à data inicial' });
            setIsSubmitting(false);
            return;
        }

        // Calcular número de dias
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        if (diffDays > 30) {
            setResult({ success: false, message: 'Máximo de 30 dias por vez' });
            setIsSubmitting(false);
            return;
        }

        let successCount = 0;
        let errorCount = 0;

        // Interditar cada dia no intervalo
        for (let i = 0; i < diffDays; i++) {
            const currentDate = addDays(start, i);
            const result = await onBlockCourt(selectedCourt, currentDate);
            
            if (result.success) {
                successCount++;
            } else {
                errorCount++;
            }
        }

        if (errorCount === 0) {
            setResult({ 
                success: true, 
                message: `✅ ${successCount} dia(s) interditado(s) com sucesso! Horários livres bloqueados, agendamentos existentes mantidos.` 
            });
        } else {
            setResult({ 
                success: false, 
                message: `⚠️ ${successCount} dia(s) interditado(s), ${errorCount} erro(s). Tente novamente ou contate o suporte.` 
            });
        }

        setIsSubmitting(false);
        
        // Limpar formulário após 3 segundos
        setTimeout(() => {
            setStartDate('');
            setEndDate('');
            setResult(null);
        }, 3000);
    };

    const handleUnblock = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!unblockStartDate) {
            setUnblockResult({ success: false, message: 'Selecione a data de início' });
            return;
        }

        setIsUnblocking(true);
        setUnblockResult(null);

        const start = new Date(unblockStartDate + 'T00:00:00');
        const end = unblockEndDate ? new Date(unblockEndDate + 'T00:00:00') : start;
        
        // Validar que a data final não é anterior à inicial
        if (end < start) {
            setUnblockResult({ success: false, message: 'Data final não pode ser anterior à data inicial' });
            setIsUnblocking(false);
            return;
        }

        // Calcular número de dias
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        if (diffDays > 30) {
            setUnblockResult({ success: false, message: 'Máximo de 30 dias por vez' });
            setIsUnblocking(false);
            return;
        }

        let successCount = 0;
        let errorCount = 0;

        // Remover interdição de cada dia no intervalo
        for (let i = 0; i < diffDays; i++) {
            const currentDate = addDays(start, i);
            const result = await onUnblockCourt(unblockCourt, currentDate);
            
            if (result.success) {
                successCount++;
            } else {
                errorCount++;
            }
        }

        if (errorCount === 0) {
            setUnblockResult({ 
                success: true, 
                message: `✅ ${successCount} dia(s) liberado(s) com sucesso! Quadra disponível novamente.` 
            });
        } else {
            setUnblockResult({ 
                success: false, 
                message: `⚠️ ${successCount} dia(s) liberado(s), ${errorCount} erro(s). Tente novamente.` 
            });
        }

        setIsUnblocking(false);
        
        // Limpar formulário após 3 segundos
        setTimeout(() => {
            setUnblockStartDate('');
            setUnblockEndDate('');
            setUnblockResult(null);
        }, 3000);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-semibold text-amber-900 mb-2">ℹ️ Como funciona</h3>
                <ul className="text-xs text-amber-800 space-y-1 list-disc list-inside">
                    <li>Interdita os horários LIVRES do dia selecionado</li>
                    <li>Útil para manutenção, chuva ou eventos especiais</li>
                    <li>Você pode interditar um único dia ou um período (máx 30 dias)</li>
                    <li><strong>✅ Horários já agendados são MANTIDOS (não serão cancelados)</strong></li>
                    <li>Pode interditar a qualquer momento, mesmo no meio do dia</li>
                </ul>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Selecione a Quadra
                    </label>
                    <select
                        value={selectedCourt}
                        onChange={(e) => setSelectedCourt(Number(e.target.value))}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red"
                    >
                        {allCourts.map(court => (
                            <option key={court.id} value={court.id}>
                                {court.name} {court.id <= 2 ? '(Tênis)' : '(Beach Tennis)'}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Data Inicial *
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Data Final (opcional)
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min={startDate}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Deixe em branco para interditar apenas 1 dia
                        </p>
                    </div>
                </div>

                {result && (
                    <div className={`p-4 rounded-lg ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                        <p className={`text-sm font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                            {result.message}
                        </p>
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={isSubmitting || !startDate}
                        className="flex-1 px-4 py-3 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSubmitting ? '🔒 Interditando...' : '🔒 Interditar Quadra'}
                    </button>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600">
                        <strong>Exemplo:</strong> Se você selecionar "Data Inicial: 25/02" e "Data Final: 27/02", 
                        a quadra será interditada nos dias 25, 26 e 27 de fevereiro (3 dias).
                    </p>
                </div>
            </form>

            {/* Divisória */}
            <div className="my-8 border-t-2 border-gray-200"></div>

            {/* Formulário de Remoção de Interdição */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-semibold text-green-900 mb-2">🔓 Remover Interdição</h3>
                <ul className="text-xs text-green-800 space-y-1 list-disc list-inside">
                    <li>Remove a interdição e libera a quadra novamente</li>
                    <li>Útil quando a chuva passa ou manutenção termina antes do previsto</li>
                    <li>Os horários voltam a ficar disponíveis para agendamento</li>
                    <li><strong>✅ Agendamentos normais existentes são mantidos</strong></li>
                </ul>
            </div>

            <form onSubmit={handleUnblock} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Selecione a Quadra
                    </label>
                    <select
                        value={unblockCourt}
                        onChange={(e) => setUnblockCourt(Number(e.target.value))}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                        {allCourts.map(court => (
                            <option key={court.id} value={court.id}>
                                {court.name} {court.id <= 2 ? '(Tênis)' : '(Beach Tennis)'}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Data Inicial *
                        </label>
                        <input
                            type="date"
                            value={unblockStartDate}
                            onChange={(e) => setUnblockStartDate(e.target.value)}
                            required
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Data Final (opcional)
                        </label>
                        <input
                            type="date"
                            value={unblockEndDate}
                            onChange={(e) => setUnblockEndDate(e.target.value)}
                            min={unblockStartDate}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Deixe em branco para liberar apenas 1 dia
                        </p>
                    </div>
                </div>

                {unblockResult && (
                    <div className={`p-4 rounded-lg ${unblockResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                        <p className={`text-sm font-medium ${unblockResult.success ? 'text-green-800' : 'text-red-800'}`}>
                            {unblockResult.message}
                        </p>
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={isUnblocking || !unblockStartDate}
                        className="flex-1 px-4 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        {isUnblocking ? '🔓 Liberando...' : '🔓 Liberar Quadra'}
                    </button>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600">
                        <strong>Dica:</strong> Use esta função quando a chuva passar rapidamente ou a manutenção terminar antes do esperado.
                    </p>
                </div>
            </form>
        </div>
    );
};
