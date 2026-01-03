import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const MAPS_URL = "https://goo.gl/maps/2QwQwQwQwQwQwQwQ8"; // Cambia por la ubicación real

const estadoColor = {
  confirmada: "bg-emerald-100 text-emerald-800",
  pendiente_pago: "bg-yellow-100 text-yellow-800",
  cancelada: "bg-red-100 text-red-800",
};

export default function MiReserva() {
  const [codigo, setCodigo] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [reserva, setReserva] = useState<any | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const buscarReserva = async () => {
    setLoading(true);
    setError("");
    setReserva(null);

    const codigoLimpio = codigo.trim();
    const emailLimpio = email.trim().toLowerCase();

    const { data, error } = await supabase
      .from('reservas')
      .select('id, codigo_reserva, email, fecha_entrada, fecha_salida, estado')
      .eq('codigo_reserva', codigoLimpio)
      .eq('email', emailLimpio)
      .maybeSingle();

    setLoading(false);

    if (error) {
      console.error('Error de Supabase:', error.message || error);
      setError('Error al buscar la reserva. Revisa la consola.');
      return;
    }

    if (!data) {
      setError('No se encuentra la reserva. Revisa el código y el email.');
      return;
    }

    // Guardar y navegar
    navigate('/informacion-reserva', { state: { reserva: data } });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12 px-4 max-w-xl">
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-6 text-center">Gestionar mi Reserva</h1>
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Código de Reserva</label>
            <Input value={codigo} onChange={e => setCodigo(e.target.value)} placeholder="MTZ-XXXX" maxLength={10} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" type="email" />
          </div>
          <Button onClick={buscarReserva} disabled={loading || !codigo || !email} className="w-full">Buscar</Button>
          {error && <div className="mt-4 text-red-600 text-sm">{error}</div>}
        </div>

        {reserva && (
          <div className="bg-emerald-50 rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <Badge className={estadoColor[reserva.estado] || "bg-gray-100 text-gray-800"}>
                {reserva.estado === "confirmada" ? "Confirmada" : reserva.estado === "pendiente_pago" ? "Pendiente de pago" : "Cancelada"}
              </Badge>
              <span className="text-xs text-muted-foreground">Código: {reserva.codigo_reserva}</span>
            </div>
            <div className="mb-4">
              <div className="font-semibold text-lg mb-1">Estancia</div>
              <div className="flex gap-2 items-center">
                <img src={reserva.cant_privado > 0 ? require("@/assets/habitacionportada.png") : require("@/assets/habitacionportada2.png")} alt="Habitación" className="w-20 h-16 object-cover rounded" />
                <div>
                  <div className="text-sm font-medium">{reserva.cant_privado > 0 ? "Habitación con baño privado" : "Habitación con baño compartido"}</div>
                  <div className="text-xs text-muted-foreground">{reserva.fecha_entrada} &rarr; {reserva.fecha_salida} ({Math.max(1, (new Date(reserva.fecha_salida).getTime() - new Date(reserva.fecha_entrada).getTime()) / (1000*60*60*24))} noches)</div>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <div className="font-semibold text-lg mb-1">Servicios incluidos</div>
              <div className="text-sm text-muted-foreground">{reserva.adultos} adultos, {reserva.ninos} niños{reserva.mascota ? ", con mascota" : ""}</div>
            </div>
            <div className="mb-4">
              <div className="font-semibold text-lg mb-1">Total pagado</div>
              <div className="text-lg font-bold text-emerald-800">{reserva.total}€</div>
            </div>
            <div className="mb-4">
              <div className="font-semibold text-lg mb-1">Cómo llegar</div>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-emerald-700 hover:underline">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#2D5A27" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                Ver en Google Maps
              </a>
            </div>
            <div className="mb-2">
              <div className="font-semibold text-lg mb-1">Política de cancelación</div>
              <div className="text-sm text-muted-foreground">Puedes cancelar sin coste hasta 7 días antes del check-in. Para cancelar, contáctanos por email o WhatsApp.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
