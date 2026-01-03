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
  
  useEffect(() => {
    const p = window.prompt('Introduce la contraseña de administrador:');
    if (p === 'Monteazul2026') setAuthorized(true);
  }, []);

  const maxStockForRoom = (type: 'private' | 'shared' | 'both') => (type === 'private' ? 1 : type === 'shared' ? 3 : 3);

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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPanel;
