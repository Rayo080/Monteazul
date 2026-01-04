import { supabase } from '../supabaseClient';
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
console.log("¿Existe supabase?:", supabase);
const AdminPanel = () => {
  const [authorized, setAuthorized] = useState(false);
  const [range, setRange] = useState<any | undefined>(undefined);
  const [roomType, setRoomType] = useState<'private' | 'shared' | 'both'>('both');
  const [price, setPrice] = useState<number | ''>('');
  const [stockPrivate, setStockPrivate] = useState<number>(0);
  const [stockShared, setStockShared] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [reservas, setReservas] = useState<any[]>([]);
  const [mostrarCancelados, setMostrarCancelados] = useState(false);
  
  useEffect(() => {
    const p = window.prompt('Introduce la contraseña de administrador:');
    if (p === 'Monteazul2026') setAuthorized(true);
  }, []);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const { data, error } = await supabase
          .from('reservas')
          .select(`
            cliente_nombre,
            fecha_entrada,
            fecha_salida,
            habitacion_id,
            adultos,
            ninos,
            mascota,
            cant_privado,
            cant_publico,
            total,
            estado,
            codigo_reserva
          `)
          // Traemos todos los estados (confirmado, cancelada, etc.)
          .order('fecha_entrada', { ascending: true });

        if (error) throw error;
        if (data) setReservas(data as any[]);
      } catch (err) {
        console.error('Error al cargar reservas:', err);
      }
    };
    fetchReservas();
  }, []);

  const maxStockForRoom = (type: 'private' | 'shared' | 'both') => (type === 'private' ? 1 : type === 'shared' ? 3 : 3);

  // Función para formatear fecha 'YYYY-MM-DD' a 'DD/MM'
  const formatearFecha = (fechaStr: string | null | undefined) => {
    if (!fechaStr) return '';
    const parts = String(fechaStr).split('-');
    if (parts.length < 3) return fechaStr;
    const [, month, day] = parts;
    return `${day}/${month}`;
  };

  const updateAvailability = async () => {
    if (!range?.from || !range?.to) return alert('Selecciona rango de fechas');
    if (price === '') return alert('Introduce un precio');

    const formatDateLocal = (d: Date) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };

    const start = formatDateLocal(new Date(range.from));
    const end = formatDateLocal(new Date(range.to));

    if (!confirm(`Vas a actualizar ${roomType} desde ${start} hasta ${end}. Continuar?`)) return;

    setLoading(true);
    try {

      const updates: any = {};
      // Price fields
     if (typeof price === 'number' && price > 0) {
        if (roomType === 'both') {
          updates.precio_privada = price;
          updates.precio_compartida = price;
        } else if (roomType === 'private') {
          updates.precio_privada = price;
        } else if (roomType === 'shared') {
          updates.precio_compartida = price;
        }
      
      }

      // Stock fields
      if (roomType === 'both') {
        updates.stock_privada = stockPrivate;
        updates.stock_compartida = stockShared;
      } else if (roomType === 'private') {
        updates.stock_privada = stockPrivate;
      } else if (roomType === 'shared') {
        updates.stock_compartida = stockShared;
      }

      if (Object.keys(updates).length === 0) {
        alert('Nada para actualizar');
        setLoading(false);
        return;
      }

      // Ensure numeric types before sending to the DB
      if (updates.precio_privada !== undefined) updates.precio_privada = Number(updates.precio_privada);
      if (updates.precio_compartida !== undefined) updates.precio_compartida = Number(updates.precio_compartida);
      if (updates.stock_privada !== undefined) updates.stock_privada = Number(updates.stock_privada);
      if (updates.stock_compartida !== undefined) updates.stock_compartida = Number(updates.stock_compartida);

      // Update rows in date range and request count of affected rows
      const { data, error, count } = await supabase
        .from('disponibilidad')
        .update(updates)
        .gte('date', start)
        .lte('date', end)
        .select('*', { count: 'exact' });

      if (error) throw error;

      const affected = typeof count === 'number' ? count : Array.isArray(data) ? data.length : 0;
      alert(`Cambios guardados correctamente. Filas afectadas: ${affected}`);
    } catch (err: any) {
      console.error(err);
      alert('Error al guardar cambios: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  if (!authorized) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md p-6 bg-background rounded shadow">
        <h2 className="text-lg font-semibold">Acceso denegado</h2>
        <p className="text-sm text-muted-foreground mt-2">No tienes permiso para ver esta página.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Header light />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-serif mb-4">Gestión Monteazul</h1>
          <p className="mb-6 text-muted-foreground">Interfaz rápida para cambiar precios y stock masivo.</p>

          <div className="bg-background p-6 rounded shadow space-y-4">
            <div>
              <label className="block font-medium">¿Qué días quieres cambiar?</label>
              <Calendar
                mode="range"
                selected={range}
                onSelect={(r) => setRange(r)}
                disabled={undefined}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium">¿Qué habitación?</label>
                <select className="w-full p-3 border rounded" value={roomType} onChange={(e) => setRoomType(e.target.value as any)}>
                  <option value="both">Ambas</option>
                  <option value="private">Privada</option>
                  <option value="shared">Compartida</option>
                </select>
              </div>

              <div>
                <label className="block font-medium">¿A cuánto ponemos la noche?</label>
                <input type="number" className="w-full p-3 border rounded" value={price} onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))} />
              </div>

              <div>
                <label className="block font-medium">Stock</label>
                {roomType === 'both' ? (
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm mb-1">Privada (máx. 1)</div>
                      <input type="range" min={0} max={maxStockForRoom('private')} value={stockPrivate} onChange={(e) => setStockPrivate(Number(e.target.value))} />
                      <div className="text-sm mt-1">{stockPrivate} disponibles</div>
                    </div>
                    <div>
                      <div className="text-sm mb-1">Compartida (máx. 3)</div>
                      <input type="range" min={0} max={maxStockForRoom('shared')} value={stockShared} onChange={(e) => setStockShared(Number(e.target.value))} />
                      <div className="text-sm mt-1">{stockShared} disponibles</div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      type="range"
                      min={0}
                      max={maxStockForRoom(roomType)}
                      value={roomType === 'private' ? stockPrivate : stockShared}
                      onChange={(e) => roomType === 'private' ? setStockPrivate(Number(e.target.value)) : setStockShared(Number(e.target.value))}
                    />
                    <div className="text-sm mt-1">{roomType === 'private' ? `${stockPrivate} disponibles` : `${stockShared} disponibles`}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4">
              <Button className="w-full py-4 text-lg bg-emerald-800 hover:bg-emerald-700" onClick={updateAvailability} disabled={loading}>
                {loading ? 'Guardando...' : 'GUARDAR CAMBIOS'}
              </Button>
            </div>
          </div>

          <div className="mt-8 overflow-x-auto p-4 bg-white rounded-xl shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <h3 className="text-2xl font-bold text-emerald-900">Gestión de Reservas</h3>

              {/* Botón para alternar cancelados */}
              <button
                onClick={() => setMostrarCancelados(!mostrarCancelados)}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  mostrarCancelados
                    ? "bg-red-500 text-white shadow-inner"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {mostrarCancelados ? "Ver solo Confirmados" : "Mostrar Cancelados"}
              </button>
            </div>

            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b-2 border-gray-100 bg-gray-50 text-gray-700">
                  <th className="py-4 px-3 text-sm font-bold uppercase">Código</th>
                  <th className="py-4 px-3 text-sm font-bold uppercase">Cliente</th>
                  <th className="py-4 px-3 text-sm font-bold uppercase">Estancia</th>
                  <th className="py-4 px-3 text-sm font-bold uppercase">Personas</th>
                  <th className="py-4 px-3 text-sm font-bold uppercase">Mascotas</th>
                  <th className="py-4 px-3 text-sm font-bold uppercase">Habitaciones</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {reservas
                  .filter((res) => (mostrarCancelados ? true : res.estado !== 'cancelada'))
                  .map((res, i) => {
                    const esCancelado = String(res?.estado ?? '').toLowerCase() === 'cancelada';

                    return (
                      <tr
                        key={i}
                        className={`border-b transition-all ${
                          esCancelado
                            ? "bg-red-50/50 border-l-4 border-l-red-500"
                            : "hover:bg-emerald-50/30 border-l-4 border-l-transparent"
                        }`}
                      >
                        {/* CÓDIGO DE RESERVA */}
                        <td className="py-5 px-3 font-mono font-bold text-blue-700">{res.codigo_reserva}</td>

                        {/* NOMBRE DEL CLIENTE */}
                        <td className="py-5 px-3">
                          <div className="text-lg font-semibold">{res.cliente_nombre}</div>
                          {esCancelado && (
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-red-600 text-white font-black uppercase">Cancelado</span>
                          )}
                        </td>

                        {/* ESTANCIA */}
                        <td className={`py-5 px-3 text-base font-medium ${esCancelado ? 'text-red-500' : 'text-gray-600'}`}>
                          {formatearFecha(res.fecha_entrada)} al {formatearFecha(res.fecha_salida)}
                        </td>

                        {/* PERSONAS */}
                        <td className="py-5 px-3 text-base">
                          <span className="font-bold">{res.adultos ?? 0}</span> Ad.
                          {res.ninos > 0 && <span> / <span className="font-bold">{res.ninos}</span> Niñ.</span>}
                        </td>

                        {/* MASCOTAS */}
                        <td className="py-5 px-3 text-xl">{res.mascota ? '🐶' : <span className="text-gray-300 text-sm">No</span>}</td>

                        {/* HABITACIONES */}
                        <td className="py-5 px-3">
                          <div className="flex flex-col gap-1">
                            {res.cant_privado > 0 && (
                              <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs font-bold w-fit">{res.cant_privado} Privada(s)</span>
                            )}
                            {res.cant_publico > 0 && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold w-fit">{res.cant_publico} Compartida(s)</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPanel;
