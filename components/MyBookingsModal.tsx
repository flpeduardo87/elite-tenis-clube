import React, { useEffect, useState } from 'react';
import { XMarkIcon } from './IconComponents';
import type { Booking, User } from '../types';
import { format } from 'date-fns';

interface MyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  fetchUserBookings: () => Promise<Booking[]>;
  onCancelBooking: (bookingId: string) => Promise<void> | void;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({ isOpen, onClose, currentUser, fetchUserBookings, onCancelBooking }) => {
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(null);
      fetchUserBookings()
        .then(b => setBookings(b))
        .catch(() => setError('Falha ao carregar reservas'))
        .finally(() => setLoading(false));
    }
  }, [isOpen]); // Removido fetchUserBookings da dependência para evitar loop infinito

  if (!isOpen) return null;

  // Função para obter data+hora da reserva para comparação precisa
  const getBookingDateTime = (booking: Booking): Date => {
    const [startHour, startMin] = booking.time_slot_start.split(':').map(Number);
    const bookingDate = new Date(booking.date);
    bookingDate.setHours(startHour, startMin, 0, 0);
    return bookingDate;
  };

  const future = bookings.filter(b => getBookingDateTime(b) >= new Date());
  const past = bookings.filter(b => getBookingDateTime(b) < new Date());

  const renderList = (list: Booking[], emptyText: string) => (
    <div className="space-y-2">
      {list.length === 0 && <p className="text-sm text-gray-500">{emptyText}</p>}
      {list.map(b => {
        const dateStr = format(new Date(b.date), 'dd/MM/yyyy');
        const isOwner = b.member_id === currentUser.cpf || b.opponent_id === currentUser.cpf;
        const canCancel = isOwner && getBookingDateTime(b) >= new Date();
        return (
          <div key={b.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200 text-sm">
            <div className="flex flex-col">
              <span className="font-semibold">{dateStr} • {b.time_slot_start}-{b.time_slot_end}</span>
              <span className="text-gray-600">Quadra {b.court_id} • Tipo: {b.game_type}</span>
              <span className="text-xs text-gray-500">Jogadores: {b.member_id}{b.opponent_id ? ` vs ${b.opponent_id}` : ''}</span>
            </div>
            {canCancel && (
              <button
                onClick={() => onCancelBooking(b.id)}
                className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >Cancelar</button>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 pb-28">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[calc(100vh-14rem)]">
        <div className="flex justify-between items-center p-4 border-b flex-shrink-0">
          <h2 className="text-xl font-bold text-brand-dark">Minhas Reservas</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XMarkIcon className="h-6 w-6" /></button>
        </div>
        <div className="p-6 space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 18rem)' }}>
          {loading && <p className="text-sm text-gray-500">Carregando...</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {!loading && !error && (
            <>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Próximas</h3>
                {renderList(future, 'Nenhuma reserva futura.')}
              </div>
              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Passadas</h3>
                {renderList(past, 'Nenhuma reserva passada.')}
              </div>
            </>
          )}
        </div>
        <div className="flex justify-end p-4 bg-gray-50 rounded-b-lg">
          <button onClick={onClose} className="px-4 py-2 bg-brand-dark border border-transparent rounded-md text-sm font-medium text-white hover:bg-gray-700">Fechar</button>
        </div>
      </div>
    </div>
  );
};
