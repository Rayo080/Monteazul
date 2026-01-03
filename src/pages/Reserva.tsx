import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { loadStripe } from '@stripe/stripe-js';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import room1 from "@/assets/habitacionportada.png";
import room2 from "@/assets/habitacionportada2.png";
import { DateRange } from "react-day-picker";
import { supabase } from "@/supabaseClient";
import useEmblaCarousel from 'embla-carousel-react';
// Private room images
import ph1 from "@/assets/fotohabitacionprivada/Captura de pantalla 2026-01-02 234226.png";
import ph2 from "@/assets/fotohabitacionprivada/Captura de pantalla 2026-01-02 234337.png";
import ph3 from "@/assets/fotohabitacionprivada/Captura de pantalla 2026-01-02 234437.png";
import ph4 from "@/assets/fotohabitacionprivada/Captura de pantalla 2026-01-02 234416.png";
import ph5 from "@/assets/fotohabitacionprivada/Captura de pantalla 2026-01-02 234355.png";
// Shared room images
import sh1 from "@/assets/fotohabitacioncompartida/Captura de pantalla 2026-01-02 234131.png";
import sh2 from "@/assets/fotohabitacioncompartida/Captura de pantalla 2026-01-02 234111.png";
import sh3 from "@/assets/fotohabitacioncompartida/Captura de pantalla 2026-01-02 234048.png";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const rooms = [
  {
    id: "deluxe",
    name: "Habitación Doble con Baño Privado",
    price: 120,
    image: room1,
    desc: "Intimidad total con baño exclusivo, cama doble premium y vistas al entorno natural.",
    maxAdults: 2,
    maxChildren: 1,
    petsAllowed: true,
    maxRooms: 1,
  },
  {
    id: "suite",
    name: "Habitación Doble con Baño Compartido",
    price: 180,
    image: room2,
    desc: "Confort y luminosidad con acceso a baños compartidos impecables. Calidad al mejor precio.",
    maxAdults: 4,
    maxChildren: 2,
    petsAllowed: true,
    maxRooms: 3,
  },
];

const Reserva = () => {
  const [range, setRange] =useState<any>(undefined);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showGuests, setShowGuests] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [pets, setPets] = useState(false);
  const [petCount, setPetCount] = useState(0);
  const [petsModalOpen, setPetsModalOpen] = useState(false);
  const [allowClosePetsModal, setAllowClosePetsModal] = useState(false);
  const initialSelections = Object.fromEntries(
    rooms.map((r) => [
      r.id,
      { quantity: 0, child: false, pets: false, petCount: 0, adults: 2 },
    ])
  ) as Record<string, { quantity: number; child: boolean; pets: boolean; petCount: number; adults: number }>;
  const [roomSelections, setRoomSelections] = useState(initialSelections);
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxRoom, setLightboxRoom] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  // Booking modal state
  const [bookingRoom, setBookingRoom] = useState<string | null>(null);
  const [bookingTotal, setBookingTotal] = useState<number>(0);
  const [bookingLoading, setBookingLoading] = useState(false);
  const { toast } = useToast();
  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteEmail, setClienteEmail] = useState("");
  const [clienteTelefono, setClienteTelefono] = useState("");
  const [clienteLlegada, setClienteLlegada] = useState("");
  const [clienteNotas, setClienteNotas] = useState("");
  const [confirmedReservation, setConfirmedReservation] = useState<any | null>(null);

  const roomGalleries: Record<string, string[]> = {
    deluxe: [ph1, ph2, ph3, ph4, ph5],
    suite: [sh1, sh2, sh3],
  };
  
  // Lógica para mostrar la fecha límite de cancelación (7 días antes del check-in)
  const hoy = new Date();
  let mostrarCancelacion = false;
  let fechaFormateada = "";
  if (range?.from) {
    const fechaEntrada = new Date(range.from);
    const fechaLimite = new Date(fechaEntrada);
    fechaLimite.setDate(fechaLimite.getDate() - 7);
    mostrarCancelacion = hoy < fechaLimite;
    fechaFormateada = fechaLimite.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
    });
  }

  const MIN_GUESTS = 1;
  const MAX_ADULTS = 8;
  const MAX_CHILDREN = 4;

  const canIncrementAdults = adults < MAX_ADULTS;
  const canIncrementChildren = children < MAX_CHILDREN;
  const canDecrementAdults = adults > MIN_GUESTS;
  const canDecrementChildren = children > 0;

  const totalRoomsSelected = Object.values(roomSelections).reduce((s, r) => s + r.quantity, 0);

  const [filteredRooms, setFilteredRooms] = useState(rooms);
  const [availabilityPrivate, setAvailabilityPrivate] = useState<number | null>(null);
  const [avgPricePrivate, setAvgPricePrivate] = useState<number | null>(null);
  const [availabilityShared, setAvailabilityShared] = useState<number | null>(null);
  const [avgPriceShared, setAvgPriceShared] = useState<number | null>(null);

// Stripe public key (set VITE_STRIPE_PK in your .env)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK || 'pk_test_TU_CLAVE_PUBLICA_AQUI');

  const applySearch = () => {
    // Keep room list shown — detalles (niños/mascotas) se elegirán por habitación.
    setFilteredRooms(rooms);
    setShowCalendar(false);
    setShowGuests(false);
  };

  const formatDateLocal = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const generarCodigoReserva = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let resultado = '';
    for (let i = 0; i < 6; i++) {
      resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return `MTZ-${resultado}`;
  };

  const fetchAvailabilityForRange = async (r: DateRange | undefined) => {
    if (!r?.from || !r?.to) {
      setAvailabilityPrivate(null);
      setAvailabilityShared(null);
      return;
    }
    const start = formatDateLocal(new Date(r.from));
    const end = formatDateLocal(new Date(r.to));
    try {
      const { data, error } = await supabase
        .from("disponibilidad")
        .select("stock_privada,stock_compartida,precio_privada,precio_compartida")
        .gte("date", start)
        .lt("date", end); // exclude checkout date so nights are start..end-1
      if (error) throw error;
      if (!data || !Array.isArray(data) || data.length === 0) {
        setAvailabilityPrivate(0);
        setAvailabilityShared(0);
        setAvgPricePrivate(null);
        setAvgPriceShared(null);
        return;
      }
      const privStocks = data.map((row: any) => Number(row.stock_privada ?? 0));
      const sharedStocks = data.map((row: any) => Number(row.stock_compartida ?? 0));
      const privPrices = data.map((row: any) => Number(row.precio_privada ?? 0));
      const sharedPrices = data.map((row: any) => Number(row.precio_compartida ?? 0));
      const minPriv = privStocks.length ? Math.min(...privStocks) : 0;
      const minShared = sharedStocks.length ? Math.min(...sharedStocks) : 0;
      setAvailabilityPrivate(minPriv);
      setAvailabilityShared(minShared);
      const avgPriv = privPrices.length ? privPrices.reduce((s: number, v: number) => s + v, 0) / privPrices.length : null;
      const avgShared = sharedPrices.length ? sharedPrices.reduce((s: number, v: number) => s + v, 0) / sharedPrices.length : null;
      setAvgPricePrivate(avgPriv !== null ? Math.ceil(avgPriv) : null);
      setAvgPriceShared(avgShared !== null ? Math.ceil(avgShared) : null);
    } catch (err) {
      console.error("Error fetching availability", err);
      setAvailabilityPrivate(0);
      setAvailabilityShared(0);
      setAvgPricePrivate(null);
      setAvgPriceShared(null);
    }
  };

  useEffect(() => {
    fetchAvailabilityForRange(range as any);
  }, [range]);

  const openLightbox = (roomId: string, index = 0) => {
    setLightboxRoom(roomId);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxRoom(null);
    setLightboxIndex(0);
  };

  useEffect(() => {
    if (lightboxOpen && emblaApi) {
      emblaApi.scrollTo(lightboxIndex);
    }
  }, [lightboxOpen, emblaApi, lightboxIndex]);

  // If availability changes, ensure selected quantities do not exceed availability
  useEffect(() => {
    setRoomSelections((prev) => {
      const next = { ...prev } as typeof prev;
      for (const r of Object.keys(next)) {
        const avail = r === 'deluxe' ? availabilityPrivate : availabilityShared;
        if (avail !== null && avail !== undefined) {
          next[r] = { ...next[r], quantity: Math.min(next[r].quantity, avail) };
        }
      }
      return next;
    });
  }, [availabilityPrivate, availabilityShared]);

  // Helper: process reservation -> insert pending reservation and redirect to Stripe
  const procesarReserva = async (datos: {
    cliente_nombre: string;
    email: string;
    fecha_entrada: string;
    fecha_salida: string;
    habitacion_id: string;
    habitacion_key?: string;
    cantidad?: number;
    adultos?: number;
    ninos?: number;
    mascotas?: number;
    telefono?: string;
    notas?: string;
    total: number;
  }) => {
    const codigo = generarCodigoReserva();

    // 1) Insertar en Supabase como pendiente
    const { error: dbError } = await supabase.from('reservas').insert([{
      codigo_reserva: codigo,
      cliente_nombre: datos.cliente_nombre,
      email: datos.email,
      telefono: datos.telefono ?? null,
      fecha_entrada: datos.fecha_entrada,
      fecha_salida: datos.fecha_salida,
      habitacion_id: datos.habitacion_id,
      total: Number(datos.total),
      adultos: datos.adultos ?? 1,
      ninos: datos.ninos ?? 0,
      mascota: (datos.mascotas ?? 0) > 0,
      cant_privado: datos.habitacion_id === 'private' ? (datos.cantidad ?? 1) : 0,
      cant_publico: datos.habitacion_id === 'shared' ? (datos.cantidad ?? 1) : 0,
      notas: datos.notas ?? null,
      estado: 'pendiente_pago',
    }]);

    if (dbError) throw dbError;

    // 2) Call Supabase Edge Function to create Checkout Session server-side
    try {
      const payload = {
        total: datos.total,
        codigoReserva: codigo,
        clienteEmail: datos.email,
      };

      try {
        const res: any = await supabase.functions.invoke('create-checkout', {
          body: JSON.stringify(payload),
          headers: { 'Content-Type': 'application/json' },
        } as any);

        if (res?.error) {
          throw res.error;
        }

        const data = res?.data ?? res;
        if (data?.url) {
          window.location.href = data.url;
          return;
        }

        // fallback: try direct fetch to functions domain
      } catch (invokeErr) {
        console.warn('functions.invoke failed:', invokeErr);
        try {
          const projectHost = 'hhapopvdhddkpwpdubqi'; // from supabaseClient.ts
          const fnUrl = `https://${projectHost}.functions.supabase.co/create-checkout`;
          const r = await fetch(fnUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          const j = await r.json().catch(() => null);
          if (r.ok && j?.url) {
            window.location.href = j.url;
            return;
          }
          throw new Error(`Function fetch failed: ${r.status} ${r.statusText} ${j && j.error ? '- ' + j.error : ''}`);
        } catch (fetchErr) {
          console.error('Edge function call failed', fetchErr);
          throw fetchErr;
        }
      }
    } catch (err) {
      throw err;
    }
  };

  // Booking form submit: prepare data and call procesarReserva
  const submitBooking = async () => {
    if (!bookingRoom) {
      toast({ title: 'Reserva', description: 'Selecciona una habitación', variant: 'destructive' } as any);
      return;
    }
    if (!range?.from || !range?.to) {
      toast({ title: 'Reserva', description: 'Selecciona fechas', variant: 'destructive' } as any);
      return;
    }
    if (!clienteNombre || !clienteEmail) {
      toast({ title: 'Reserva', description: 'Introduce nombre y correo', variant: 'destructive' } as any);
      return;
    }

    setBookingLoading(true);
    try {
      const fecha_entrada = formatDateLocal(new Date(range.from));
      const fecha_salida = formatDateLocal(new Date(range.to));
      const habitacion_id = bookingRoom === 'deluxe' ? 'private' : 'shared';
      const nights = range?.from && range?.to ? Math.max(1, Math.round((new Date(range.to).getTime() - new Date(range.from).getTime()) / (1000 * 60 * 60 * 24))) : 1;
      const qty = roomSelections[bookingRoom]?.quantity || 0;
      const avg = bookingRoom === 'deluxe' ? avgPricePrivate : avgPriceShared;
      const unit = (range?.from && avg !== null && avg !== undefined) ? avg : rooms.find(r => r.id === bookingRoom)?.price ?? 0;
      const total = Number(unit * nights * (qty > 0 ? qty : 1));

      await procesarReserva({
        cliente_nombre: clienteNombre,
        email: clienteEmail,
        fecha_entrada,
        fecha_salida,
        habitacion_id,
        habitacion_key: bookingRoom || undefined,
        cantidad: qty || 1,
        adultos: roomSelections[bookingRoom!]?.adults ?? 1,
        ninos: roomSelections[bookingRoom!]?.child ? 1 : 0,
        mascotas: roomSelections[bookingRoom!]?.petCount ?? 0,
        telefono: clienteTelefono || undefined,
        notas: clienteNotas || undefined,
        total,
      });
    } catch (err: any) {
      console.error(err);
      toast({ title: 'Error', description: `Error al procesar la reserva: ${err?.message || err}`, variant: 'destructive' } as any);
    } finally {
      setBookingLoading(false);
    }
  };


  const incrementPet = () => {
    if (petCount >= 2) return;
    const next = petCount + 1;
    setPetCount(next);
    setPets(true);
  };

  const decrementPet = () => {
    if (petCount <= 0) return;
    const next = petCount - 1;
    setPetCount(next);
    if (next === 0) setPets(false);
  };

  


  return (
    <div className="min-h-screen">
      <Header light />
      <main className="py-16">
        <div className="container mx-auto px-4">
          <div className="mt-6 mb-6">
            <Button asChild variant="ghost" size="sm">
              <Link to="/" className="flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" />
                Volver
              </Link>
            </Button>
          </div>

          <div className="text-center max-w-3xl mx-auto mb-10">
            <h1 className="font-serif text-4xl md:text-5xl font-bold">
              Reserva
            </h1>
            <p className="text-muted-foreground mt-3">
              Elige tu habitación y las fechas disponibles. Mantén la calma;
              estamos aquí para ayudarte.
            </p>
          </div>

          {/* Search bar */}

          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-background p-3 rounded-lg shadow-sm transition-all duration-300">
              <div className="flex flex-col md:flex-row items-center gap-3">
                {/* Date selector button */}
                <div className="flex-1 w-full">
                  <label className="text-sm text-muted-foreground block mb-1">Fechas</label>
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 bg-white border rounded-md"
                    onClick={() => {
                      setShowCalendar((s) => !s);
                      setShowGuests(false);
                    }}
                  >
                    <div className="text-sm">
                      {range?.from ? range.from.toLocaleDateString() : "Check-in"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {range?.to ? range.to.toLocaleDateString() : "Check-out"}
                    </div>
                  </button>
                </div>
                {/* Buscar button */}
                <div className="w-32 md:w-48">
                  <label className="text-sm text-muted-foreground block mb-1 invisible">Buscar</label>
                  <button
                    className="w-full px-4 py-2 rounded-md text-white bg-emerald-800 hover:bg-emerald-700"
                    onClick={applySearch}
                  >
                    Buscar
                  </button>
                </div>
              </div>

              {/* Unified dropdown panels below the entire bar */}
              <div
                className="mt-3 overflow-hidden transition-all duration-300"
                style={{ maxHeight: showCalendar ? 800 : 0 }}
                aria-hidden={!showCalendar}
              >
                <div className="grid gap-3">
                  {showCalendar && (
                    <div className="w-full p-4 bg-muted/20 rounded-md">
                      <Calendar
                        mode="range"
                        selected={range}
                        onSelect={(r) => {
                          setRange(r as any);
                          setShowGuests(false);
                        }}
                        disabled={{ before: new Date() }}
                        highlightToday={false}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contacto/Oferta box */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg shadow-sm mt-4 p-4 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="text-emerald-900 text-sm md:text-base font-medium flex-1">
                ¿Quieres un precio más bajo? <br className="hidden md:block" />
                <span className="font-semibold">Llámanos o escríbenos:</span>
                <span className="ml-2 text-emerald-800 font-bold text-sm md:text-base">+34 651 39 12 28</span>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <a
                  href="tel:+34651391228"
                  className="inline-flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-white border border-emerald-200 shadow hover:bg-emerald-100 transition"
                  title="Llamar"
                  rel="noopener noreferrer"
                >
                  {/* Phone icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#2D5A27" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3.08 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72c.13.81.37 1.6.7 2.34a2 2 0 0 1-.45 2.11L9.03 10.91a16 16 0 0 0 6.06 6.06l1.74-1.22a2 2 0 0 1 2.11-.45c.74.33 1.53.57 2.34.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </a>
                <a
                  href="https://wa.me/34651391228"
                  target="_blank"
                  className="inline-flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-white border border-emerald-200 shadow hover:bg-emerald-100 transition"
                  title="Mensaje"
                  rel="noopener noreferrer"
                >
                  {/* Message icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#2D5A27" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="4" />
                    <path d="M8 10h8M8 14h5" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="grid gap-8">
            <div className="space-y-6">
              {range?.from ? (
                filteredRooms
                  .filter((room) => {
                    const avail = room.id === 'deluxe' ? availabilityPrivate : availabilityShared;
                    // If a date range is selected and availability is 0, hide the room.
                    if (range?.from && (avail === 0)) return false;
                    return true;
                  })
                  .map((room) => (
                <div
                  key={room.id}
                  className="flex flex-col md:flex-row gap-4 md:gap-6 bg-background rounded-lg shadow-md p-4 md:p-6 items-start md:items-center"
                >
                    <div className="w-full md:w-40 flex-shrink-0 relative">
                      <img
                        src={room.image}
                        alt={room.name}
                        className="w-full h-36 md:h-28 object-cover rounded-md cursor-pointer"
                        onClick={() => openLightbox(room.id, 0)}
                      />
                      {/* Eye icon overlay */}
                      <button
                        type="button"
                        className="absolute top-2 right-2 z-10 bg-white/80 rounded-full p-1 shadow-md flex items-center justify-center hover:bg-emerald-100 transition"
                        onClick={() => openLightbox(room.id, 0)}
                        aria-label="Ver fotos de la habitación"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2D5A27" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                          <circle cx="12" cy="12" r="3.5" />
                        </svg>
                      </button>
                      <div className="mt-3 flex justify-center">
                        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-100 px-3 py-1 rounded-full shadow-sm text-sm">
                          {(() => {
                            const avail = room.id === 'deluxe' ? availabilityPrivate : availabilityShared;
                            const availText = avail ?? '-';
                            return <span className="font-medium">{availText} disponibles</span>;
                          })()}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                    <h3 className="font-serif text-lg md:text-2xl font-semibold">
                      {room.name}
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm md:text-base">{room.desc}</p>
                    <div className="mt-3 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
                      <span className="text-lg md:text-xl font-bold">{
                        (() => {
                          const qty = roomSelections[room.id]?.quantity || 0;
                          const avg = room.id === 'deluxe' ? avgPricePrivate : avgPriceShared;
                          if (range?.from && avg !== null && avg !== undefined) {
                            const total = avg * (qty > 0 ? qty : 1);
                            return `${total}€/noche`;
                          }
                          const base = room.price;
                          const totalBase = base * (qty > 0 ? qty : 1);
                          return `${totalBase}€/noche`;
                        })()
                      }</span>

                      <div className="flex items-center gap-2">
                        <button
                          className={"px-2 py-1 border rounded " + (roomSelections[room.id].quantity <= 0 ? "opacity-50 cursor-not-allowed" : "")}
                          onClick={() =>
                            setRoomSelections((p) => ({
                              ...p,
                              [room.id]: { ...p[room.id], quantity: Math.max(0, p[room.id].quantity - 1) },
                            }))
                          }
                          disabled={roomSelections[room.id].quantity <= 0}
                        >
                          -
                        </button>
                        <div className="w-8 text-center">{roomSelections[room.id].quantity}</div>
                        <button
                          className={"px-2 py-1 border rounded " + ((): string => {
                            const avail = room.id === 'deluxe' ? availabilityPrivate : availabilityShared;
                            const max = (avail !== null && avail !== undefined) ? avail : (room.maxRooms || 1);
                            return roomSelections[room.id].quantity >= max ? "opacity-50 cursor-not-allowed" : "";
                          })()}
                          onClick={() =>
                            setRoomSelections((p) => {
                              const avail = room.id === 'deluxe' ? availabilityPrivate : availabilityShared;
                              const max = (avail !== null && avail !== undefined) ? avail : (room.maxRooms || 1);
                              return ({
                                ...p,
                                [room.id]: { ...p[room.id], quantity: Math.min(max, p[room.id].quantity + 1) },
                              });
                            })
                          }
                          disabled={(() => {
                            const avail = room.id === 'deluxe' ? availabilityPrivate : availabilityShared;
                            const max = (avail !== null && avail !== undefined) ? avail : (room.maxRooms || 1);
                            return roomSelections[room.id].quantity >= max;
                          })()}
                        >
                          +
                        </button>
                      </div>

                      <Button
                        variant="luxury"
                        size="sm"
                        disabled={roomSelections[room.id].quantity <= 0}
                        onClick={() => {
                          const qty = roomSelections[room.id]?.quantity || 0;
                          const avg = room.id === 'deluxe' ? avgPricePrivate : avgPriceShared;
                          const unit = (range?.from && avg !== null && avg !== undefined) ? avg : room.price;
                          const nights = range?.from && range?.to ? Math.max(1, Math.round((new Date(range.to).getTime() - new Date(range.from).getTime()) / (1000 * 60 * 60 * 24))) : 1;
                          const total = unit * nights * (qty > 0 ? qty : 1);
                          setBookingRoom(room.id);
                          setBookingTotal(total);
                          setClienteNombre("");
                          setClienteEmail("");
                          setClienteTelefono("");
                          setClienteLlegada("");
                          setClienteNotas("");
                        }}
                      >
                        Reservar
                      </Button>
                    </div>

                    <div className="flex flex-col items-end mt-2">
                      {range?.from && (
                        <p className="text-[10px] md:text-xs text-gray-500 mt-2 text-right leading-tight max-w-[150px]">
                          {mostrarCancelacion ? (
                            <>
                              🛡️ Cancelación gratuita hasta el <span className="font-medium">{fechaFormateada}</span>
                            </>
                          ) : (
                            <>Sin cancelacion Gratuita</>
                          )}
                        </p>
                      )}
                    </div>

                      <div className="mt-3 space-y-2 text-sm">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="text-sm">Adultos</div>
                            <div className="text-xs text-muted-foreground">(+16años)</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              className={"px-2 py-1 border rounded " + (roomSelections[room.id].adults <= 1 ? "opacity-50 cursor-not-allowed" : "")}
                              onClick={() =>
                                setRoomSelections((p) => ({
                                  ...p,
                                  [room.id]: { ...p[room.id], adults: Math.max(1, p[room.id].adults - 1) },
                                }))
                              }
                              disabled={roomSelections[room.id].adults <= 1}
                            >
                              -
                            </button>
                            <div className="w-6 text-center">{roomSelections[room.id].adults}</div>
                            <button
                              className={"px-2 py-1 border rounded " + (roomSelections[room.id].adults >= 2 ? "opacity-50 cursor-not-allowed" : "")}
                              onClick={() =>
                                setRoomSelections((p) => ({
                                  ...p,
                                  [room.id]: { ...p[room.id], adults: Math.min(2, p[room.id].adults + 1) },
                                }))
                              }
                              disabled={roomSelections[room.id].adults >= 2}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={roomSelections[room.id].child}
                            onChange={() =>
                              setRoomSelections((p) => ({
                                ...p,
                                [room.id]: { ...p[room.id], child: !p[room.id].child },
                              }))
                            }
                          />
                          <span>Acompañado de un niño/bebé (máx. 1)</span>
                        </label>

                      <div>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={roomSelections[room.id].pets}
                            onChange={() =>
                              setRoomSelections((p) => {
                                const next = !p[room.id].pets;
                                return {
                                  ...p,
                                  [room.id]: {
                                    ...p[room.id],
                                    pets: next,
                                    petCount: next ? Math.max(1, p[room.id].petCount) : 0,
                                  },
                                };
                              })
                            }
                          />
                          <span>Traigo mascotas</span>
                        </label>

                        {roomSelections[room.id].pets && (
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              className={"px-2 py-1 border rounded " + (roomSelections[room.id].petCount <= 1 ? "opacity-50 cursor-not-allowed" : "")}
                              onClick={() =>
                                setRoomSelections((p) => ({
                                  ...p,
                                  [room.id]: { ...p[room.id], petCount: Math.max(1, p[room.id].petCount - 1) },
                                }))
                              }
                              disabled={roomSelections[room.id].petCount <= 1}
                            >
                              -
                            </button>
                            <div className="w-6 text-center">{roomSelections[room.id].petCount}</div>
                            <button
                              className={"px-2 py-1 border rounded " + (roomSelections[room.id].petCount >= 2 ? "opacity-50 cursor-not-allowed" : "")}
                              onClick={() =>
                                setRoomSelections((p) => ({
                                  ...p,
                                  [room.id]: { ...p[room.id], petCount: Math.min(2, p[room.id].petCount + 1) },
                                }))
                              }
                              disabled={roomSelections[room.id].petCount >= 2}
                            >
                              +
                            </button>
                          </div>
                        )}

                        <div>
                          <button
                            type="button"
                            className="text-xs text-emerald-800 underline mt-2"
                            onClick={() => setPetsModalOpen(true)}
                          >
                            Ver condiciones de mascotas
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">Elige fechas para ver disponibilidad</div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      
      <Dialog
        open={petsModalOpen}
        onOpenChange={(open) => {
          if (!open && !allowClosePetsModal) return;
          setPetsModalOpen(open);
          if (!open) setAllowClosePetsModal(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aviso sobre mascotas</DialogTitle>
            <DialogDescription>
              Aviso sobre mascotas: Se aplicará un cargo adicional por mascota y por día. Es obligatorio que cada mascota traiga su propia jaula para su estancia.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>
              <Button
                className="bg-emerald-800 text-white hover:bg-emerald-700"
                onClick={() => {
                  setAllowClosePetsModal(true);
                  setPetsModalOpen(false);
                }}
              >
                Aceptar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Confirmation modal */}
      <Dialog open={!!confirmedReservation} onOpenChange={(open) => { if (!open) setConfirmedReservation(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reserva Confirmada</DialogTitle>
            <DialogDescription>Detalles de tu reserva y código de referencia.</DialogDescription>
          </DialogHeader>

          {confirmedReservation && (
            <div className="py-6 text-center">
              <div className="text-5xl md:text-6xl font-extrabold text-emerald-800">{confirmedReservation.codigo}</div>
              <div className="mt-4 text-lg">¡Gracias {confirmedReservation.nombre.split(' ')[0] || confirmedReservation.nombre}!</div>
              <div className="mt-2 text-sm text-muted-foreground">Tu reserva está confirmada</div>
              <div className="mt-3 text-sm">Fechas: {confirmedReservation.fecha_entrada} — {confirmedReservation.fecha_salida}</div>
              <div className="mt-1 text-sm">Habitación: {confirmedReservation.habitacion_id}</div>
              <div className="mt-1 text-sm font-semibold">Total: {confirmedReservation.total_pagado}€</div>
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  className="px-4 py-2 rounded bg-emerald-800 text-white"
                  onClick={() => {
                    try { navigator.clipboard.writeText(confirmedReservation.codigo); toast({ title: 'Copiado', description: 'Código copiado al portapapeles' } as any); } catch { }
                  }}
                >Copiar código</button>
                <DialogClose>
                  <Button onClick={() => setConfirmedReservation(null)}>Cerrar</Button>
                </DialogClose>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Booking modal */}
      <Dialog open={!!bookingRoom} onOpenChange={(open) => { if (!open) setBookingRoom(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Formulario de reserva</DialogTitle>
            <DialogDescription>
              Completa tus datos para finalizar la reserva.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="text-sm">
              <strong>Habitación:</strong> {bookingRoom === 'deluxe' ? 'Privada' : bookingRoom === 'suite' ? 'Compartida' : ''}
            </div>
            <div className="text-sm">
              <strong>Fechas:</strong> {range?.from ? formatDateLocal(new Date(range.from)) : '-'} — {range?.to ? formatDateLocal(new Date(range.to)) : '-'}
            </div>
            <div className="text-sm">
              <strong>Precio total:</strong> {bookingTotal}€
            </div>

            <div>
              <label className="block text-sm">Nombre y Apellidos</label>
              <input className="w-full p-2 border rounded" value={clienteNombre} onChange={(e) => setClienteNombre(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm">Correo electrónico</label>
              <input className="w-full p-2 border rounded" value={clienteEmail} onChange={(e) => setClienteEmail(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm">Teléfono</label>
              <input className="w-full p-2 border rounded" value={clienteTelefono} onChange={(e) => setClienteTelefono(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm">Hora de llegada / notas (opcional)</label>
              <input className="w-full p-2 border rounded" value={clienteLlegada} onChange={(e) => setClienteLlegada(e.target.value)} placeholder="Ej. 18:30 - Traigo equipaje" />
            </div>
          </div>

          <DialogFooter>
            <DialogClose>
              <Button className="mr-2" onClick={() => setBookingRoom(null)} disabled={bookingLoading}>Cancelar</Button>
            </DialogClose>
            <Button className="bg-emerald-800 text-white hover:bg-emerald-700" onClick={submitBooking} disabled={bookingLoading || !clienteNombre || !clienteEmail}>
              {bookingLoading ? 'Enviando...' : 'Confirmar reserva'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Lightbox modal */}
      {lightboxOpen && lightboxRoom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)' }}
          onClick={closeLightbox}
        >
          <div className="relative w-full h-full md:h-auto max-w-5xl mx-4 md:mx-auto" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute right-3 top-3 text-emerald-800 text-2xl z-40 bg-white/80 rounded-full p-1 shadow-md"
              onClick={closeLightbox}
              aria-label="Cerrar"
            >
              ×
            </button>

            <div className="overflow-visible rounded-md">
              <div className="embla h-full" ref={emblaRef as any}>
                <div className="embla__container flex h-full">
                  {roomGalleries[lightboxRoom].map((src, idx) => (
                    <div key={idx} className="embla__slide flex-shrink-0 w-full flex items-center justify-center min-h-screen md:min-h-0 p-6">
                      <img src={src} alt={`image-${idx}`} className="max-h-[80vh] object-contain rounded-md" style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <button
                className="text-emerald-800 text-3xl px-3 py-1 bg-white/80 rounded-full shadow-md"
                onClick={() => { if (emblaApi) emblaApi.scrollPrev(); }}
                aria-label="Anterior"
              >
                ‹
              </button>
            </div>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <button
                className="text-emerald-800 text-3xl px-3 py-1 bg-white/80 rounded-full shadow-md"
                onClick={() => { if (emblaApi) emblaApi.scrollNext(); }}
                aria-label="Siguiente"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default Reserva;
