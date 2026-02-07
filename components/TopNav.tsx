import React from 'react';

interface TopNavProps {
    onLogoClick?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onLogoClick }) => {
    return (
        <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-soft">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <button 
                    onClick={onLogoClick}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                    <div className="bg-white rounded-full p-2 flex items-center justify-center w-14 h-14">
                        <img src="/logo-elite.png" alt="Elite Logo" className="h-10 w-10" />
                    </div>
                    <div className="text-left">
                        <h1 className="text-2xl font-bold text-brand-dark">Canoinhas Tênis Clube</h1>
                        <p className="text-[10px] text-gray-500 -mt-1">RESERVA DE QUADRAS</p>
                    </div>
                </button>

                {/* Right side - could add user info or actions */}
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 font-medium hidden sm:block">
                        Elite Tênis
                    </span>
                </div>
            </div>
        </nav>
    );
};
