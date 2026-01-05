import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const roomImages: Record<string, string> = {
  deluxe: '/assets/fotohabitacionprivada/Captura de pantalla 2026-01-02 234226.png',
  suite: '/assets/fotohabitacioncompartida/Captura de pantalla 2026-01-02 234131.png',
};

export const Exito = () => {
  const [searchParams] = useSearchParams();
  const codigo = searchParams.get('codigo');
  const sessionId = searchParams.get('session_id');
  const [confirmado, setConfirmado] = useState(false);
  const [reserva, setReserva] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const confirmarReserva = async () => {
      if (!codigo) {
        navigate('/');
        return;
      }

      // Get the reservation
      const { data, error } = await supabase
        .from('reservas')
        .select('*')
        .eq('codigo_reserva', codigo)
        .single();

      if (error || !data) {
        navigate('/');
        return;
      }

      setReserva(data);

      // Only proceed if it's still pending payment (prevent direct visits)
      if (data.estado === 'confirmada') {
        setConfirmado(true);
        return;
      }

      try {
        // Decrement availability for each date in the reservation range
        const start = data.fecha_entrada;
        const end = data.fecha_salida;
        const cantidad = Number(data.cant_privado ?? data.cant_publico ?? data.cantidad ?? 1);
        const habitacion = data.habitacion_id;

        // Fetch availability rows for nights: start <= date < end
        const { data: availRows, error: availError } = await supabase
          .from('disponibilidad')
          .select('*')
          .gte('date', start)
          .lt('date', end);

        if (!availError && Array.isArray(availRows)) {
          for (const row of availRows) {
            const id = row.id;
            if (!id) continue;
            if (habitacion === 'private') {
              const current = Number(row.stock_privada ?? 0);
              const next = Math.max(0, current - cantidad);
              await supabase.from('disponibilidad').update({ stock_privada: next }).eq('id', id);
            } else {
              const current = Number(row.stock_compartida ?? 0);
              const next = Math.max(0, current - cantidad);
              await supabase.from('disponibilidad').update({ stock_compartida: next }).eq('id', id);
            }
          }
        }

        // Mark reservation as confirmed
        await supabase.from('reservas').update({ estado: 'confirmada', confirmado_en: new Date().toISOString() }).eq('codigo_reserva', codigo);

        // Attempt to send confirmation email via an Edge Function (if configured)
        try {
          await supabase.functions.invoke('send-confirmation', { body: JSON.stringify({ codigo_reserva: codigo }) } as any);
        } catch (fnErr) {
          console.warn('send-confirmation function failed:', fnErr);
        }

        setConfirmado(true);
      } catch (err) {
        console.error('Error confirming reservation', err);
      }
    };

    confirmarReserva();
  }, [codigo, navigate]);

  if (!codigo) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-white p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 bg-green-100 flex items-center justify-center p-6">
            <img
              src="/tick-verde.svg"
              alt="Confirmado"
              className="w-32 h-32 mx-auto drop-shadow-lg"
            />
          </div>
          <div className="p-6 md:w-2/3 flex flex-col justify-center">
            <h1 className="text-4xl font-extrabold text-green-700 mb-2">{confirmado ? '¡Reserva Confirmada!' : 'Procesando pago...'}</h1>
            <p className="mb-4 text-gray-700 text-lg">{confirmado ? 'Tu reserva está confirmada y lista para disfrutar.' : 'Estamos procesando tu pago, espera unos segundos...'}</p>
            {reserva && (
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg font-bold bg-green-50 px-3 py-1 rounded">{reserva.codigo_reserva}</span>
                  <span className="text-xs text-green-700 font-semibold">Código de reserva</span>
                </div>
                <div className="text-lg font-semibold">{reserva.cliente_nombre}</div>
                <div className="text-sm text-gray-600">{reserva.email}</div>
                <div className="text-sm text-gray-600">{reserva.telefono}</div>
                <div className="text-base mt-2">
                  <strong>Fechas:</strong> {reserva.fecha_entrada} → {reserva.fecha_salida}
                  {(() => {
                    if (reserva.fecha_entrada && reserva.fecha_salida) {
                      const d1 = new Date(reserva.fecha_entrada);
                      const d2 = new Date(reserva.fecha_salida);
                      const noches = Math.max(1, Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
                      return ` (${noches} noche${noches > 1 ? 's' : ''})`;
                    }
                    return '';
                  })()}
                </div>
                <div className="text-base"><strong>Habitación:</strong> {reserva.habitacion_id === 'private' ? 'Privada' : 'Compartida'}</div>
                <div className="text-base"><strong>Cantidad:</strong> {reserva.cant_privado || reserva.cant_publico || reserva.cantidad || 1}</div>
                <div className="text-base"><strong>Total pagado:</strong> €{reserva.total}</div>
              </div>
            )}
            <div className="mt-4 flex gap-2">
              <Link to="/" className="inline-block bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 font-semibold shadow">← Volver al inicio</Link>
              {reserva && <button className="inline-block bg-green-100 text-green-700 px-5 py-2 rounded-lg font-semibold shadow" onClick={() => navigator.clipboard.writeText(reserva.codigo_reserva)}>Copiar código</button>}
            </div>
            {reserva && (
              <details className="mt-6 bg-gray-50 rounded p-4 text-sm">
                <summary className="font-semibold cursor-pointer">Ver detalles completos de la reserva</summary>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div><strong>Adultos:</strong> {reserva.adultos}</div>
                  <div><strong>Niños:</strong> {reserva.ninos}</div>
                  <div><strong>Mascota:</strong> {reserva.mascota ? 'Sí' : 'No'}</div>
                  <div><strong>Estado:</strong> {reserva.estado}</div>
                  <div><strong>Notas:</strong> {reserva.notas}</div>
                </div>
              </details>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exito;
