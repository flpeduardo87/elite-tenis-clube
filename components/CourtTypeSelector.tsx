
import React from 'react';
import { SunIcon } from './IconComponents';

interface CourtTypeSelectorProps {
    onSelectCourtType: (type: 'tennis' | 'sand') => void;
}

export const CourtTypeSelector: React.FC<CourtTypeSelectorProps> = ({ onSelectCourtType }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-brand-bg p-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight text-brand-dark sm:text-5xl">
                    Elite Tênis Clube
                </h1>
                <p className="mt-4 text-xl text-gray-600">
                    Qual tipo de quadra você gostaria de agendar hoje?
                </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-8">
                                <button
                                        onClick={() => onSelectCourtType('tennis')}
                                        className="group flex flex-col items-center justify-center p-8 sm:p-12 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 w-72 h-72 border-4 border-transparent hover:border-brand-red"
                                >
                                        <span
                                            aria-label="Ícone Tênis"
                                            className="h-24 w-24 bg-gray-400 group-hover:bg-brand-red transition-colors duration-300"
                                            style={{
                                                WebkitMaskImage: 'url(/icon-tennis.png)',
                                                maskImage: 'url(/icon-tennis.png)',
                                                WebkitMaskRepeat: 'no-repeat',
                                                maskRepeat: 'no-repeat',
                                                WebkitMaskPosition: 'center',
                                                maskPosition: 'center',
                                                WebkitMaskSize: 'contain',
                                                maskSize: 'contain'
                                            }}
                                        />
                                        <span className="mt-6 text-2xl font-bold text-brand-dark">Tênis</span>
                                </button>
                <button
                    onClick={() => onSelectCourtType('sand')}
                    className="group flex flex-col items-center justify-center p-8 sm:p-12 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 w-72 h-72 border-4 border-transparent hover:border-amber-500"
                >
                    <SunIcon className="h-24 w-24 text-gray-400 group-hover:text-amber-500 transition-colors duration-300" />
                    <span className="mt-6 text-2xl font-bold text-brand-dark">Beach</span>
                </button>
            </div>
        </div>
    );
};