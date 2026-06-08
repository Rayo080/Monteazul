import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CalendarDays, User, Mail, Phone, BedDouble, Hash, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { supabase } from "@/supabaseClient";

const InformacionReserva: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialReserva = location.state?.reserva || null;
  const [reserva, setReserva] = useState<any | null>(initialReserva);
  console.log("RENDER INFORMACION RESERVA");
  const [searchCodigo, setSearchCodigo] = useState("");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [processingCancel, setProcessingCancel] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingReserva, setLoadingReserva] = useState(false);

  // Debug: muestra si la reserva viene por state o no
  console.log("RESERVA:", reserva);

  useEffect(() => {
    // Si ya tenemos reserva por state, no buscamos
    if (reserva) return;

    // Determinar código desde query params, path o hash
    const params = new URLSearchParams(location.search);
    // chequeos por nombre comunes
    const codigoParam = params.get("codigo") || params.get("codigo_reserva") || params.get("id") || params.get("tmp");
    // si no hay, buscar en cualquier valor de query que parezca un código (alfanum 4-40)
    let candidate: string | null = codigoParam;
    if (!candidate) {
      for (const [k, v] of params.entries()) {
        if (!v) continue;
        if (/^[A-Za-z0-9_-]{4,40}$/.test(v)) {
          candidate = v;
          console.log('Detected candidate code from query param', k, v);
          break;
        }
      }
    }

    const pathLast = location.pathname.split("/").filter(Boolean).pop() || null;
    const pathCodigo = pathLast && pathLast !== "informacion-reserva" ? pathLast : null;
    const hashCodigo = location.hash ? location.hash.replace('#', '') : null;
    const codigo = candidate || pathCodigo || hashCodigo;
    if (!codigo) return;

    fetchReservaByCodigo(codigo);
  }, [location.search, reserva]);

  // Reusable fetch function
  const fetchReservaByCodigo = async (codigo: string) => {
    try {
      setLoadingReserva(true);
      const { data, error } = await supabase
        .from("reservas")
        .select("*")
        .eq("codigo_reserva", codigo)
        .single();

      if (error) {
        console.warn("No se encontró reserva por código:", error.message || error);
        return false;
      }

      if (data) {
        setReserva(data as any);
        return true;
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingReserva(false);
    }
    return false;
  };

  // Permitir forzar la visualización del módulo de facturación vía query param
  const params = new URLSearchParams(location.search);
  const forceShowFact = params.get("showFact") === "1" || params.get("showFact") === "true";

  // Si forzamos la vista de facturación en modo debug, inyectamos una reserva temporal
  useEffect(() => {
    if (forceShowFact && !reserva) {
      const hoy = new Date();
      const mañana = new Date(hoy.getTime() + 3 * 24 * 60 * 60 * 1000);
      setReserva({
        codigo_reserva: "TEST123",
        cliente_nombre: "Usuario Test",
        fecha_entrada: hoy.toISOString().slice(0, 10),
        fecha_salida: mañana.toISOString().slice(0, 10),
        estado: "confirmada",
      } as any);
    }
  }, [forceShowFact, reserva]);

  const calcularDiasRestantes = () => {
    try {
      const hoy = new Date();
      const entrada = new Date(reserva.fecha_entrada);
      const msPorDia = 1000 * 60 * 60 * 24;
      return Math.ceil((entrada.getTime() - hoy.getTime()) / msPorDia);
    } catch (e) {
      return 0;
    }
  };
  const diasRestantes = reserva ? calcularDiasRestantes() : 0;

  console.log("RESERVA ACTUAL:", reserva);

  if (!reserva && loadingReserva && !forceShowFact) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Cargando reserva...</h2>
      </div>
    );
  }

  if (!reserva && !loadingReserva && !forceShowFact) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-2xl font-bold">Reserva no encontrada</h2>
        <p className="text-sm text-gray-600">Introduce tu código de reserva para buscarla:</p>

        <div className="w-full max-w-md">
          <div className="flex gap-2">
            <input
              value={searchCodigo}
              onChange={(e) => setSearchCodigo(e.target.value)}
              placeholder="Código de reserva"
              className="flex-1 px-3 py-2 border rounded-lg"
            />
            <button
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
              onClick={async () => {
                if (!searchCodigo) return;
                await fetchReservaByCodigo(searchCodigo.trim());
              }}
            >Buscar</button>
          </div>

          <div className="mt-3 flex gap-2">
            <button className="px-4 py-2 bg-primary text-white rounded" onClick={() => navigate('/mi-reserva')}>Volver a buscar</button>
            <button className="px-4 py-2 border rounded" onClick={() => { setSearchCodigo('TEST123'); }}>Usar TEST123</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-0 md:p-6 mt-8">
      <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-100 rounded-2xl shadow-xl border border-emerald-100">
        <h1 className="text-4xl font-serif font-bold mb-8 text-center pt-8 text-emerald-900 tracking-tight">Información de la Reserva</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 pb-8">
          <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
            <Hash className="text-emerald-600" size={28} />
            <div>
              <div className="text-xs text-gray-500">Código de Reserva</div>
              <div className="font-bold text-lg text-emerald-900">{reserva.codigo_reserva}</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
            <User className="text-emerald-600" size={28} />
            <div>
              <div className="text-xs text-gray-500">Nombre del Cliente</div>
              <div className="font-bold text-lg text-emerald-900">{reserva.cliente_nombre}</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-emerald-50">
              <Mail className="text-emerald-600" size={22} />
            </span>
            <div>
              <div className="text-xs text-gray-500">Email</div>
              <div className="font-bold text-base text-emerald-900 break-words max-w-[180px] md:max-w-[220px]">{reserva.email || reserva.cliente_email || "-"}</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
            <Phone className="text-emerald-600" size={28} />
            <div>
              <div className="text-xs text-gray-500">Teléfono</div>
              <div className="font-bold text-lg text-emerald-900">{reserva.telefono || reserva.cliente_telefono || "-"}</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
            <BedDouble className="text-emerald-600" size={28} />
            <div>
              <div className="text-xs text-gray-500">Tipo de Habitación</div>
              <div className="font-bold text-lg text-emerald-900">{
                (() => {
                  const tipo = reserva.tipo_habitacion || reserva.habitacion || reserva.room_type || reserva.tipo || reserva.habitacion_id || "-";
                  if (typeof tipo === "string") {
                    if (tipo.toLowerCase() === "shared") return "Baño compartido";
                    if (tipo.toLowerCase() === "private") return "Baño privado";
                  }
                  return tipo;
                })()
              }</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
            <Home className="text-emerald-600" size={28} />
            <div>
              <div className="text-xs text-gray-500">Cantidad de Habitaciones</div>
              <div className="font-bold text-lg text-emerald-900">{((reserva.cant_privado || 0) + (reserva.cant_publico || 0))}</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
            <CalendarDays className="text-emerald-600" size={28} />
            <div>
              <div className="text-xs text-gray-500">Fecha Entrada</div>
              <div className="font-bold text-lg text-emerald-900">{reserva.fecha_entrada}</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
            <CalendarDays className="text-emerald-600" size={28} />
            <div>
              <div className="text-xs text-gray-500">Fecha Salida</div>
              <div className="font-bold text-lg text-emerald-900">{reserva.fecha_salida}</div>
            </div>
          </div>
        </div>
        <div className="px-6 pb-8">
          <div className="bg-emerald-50 rounded-xl shadow p-5 flex flex-col gap-2 mt-4">
            <div>
              <span className="font-semibold text-emerald-700">Estado:</span> <span className="font-bold">{reserva.estado}</span>
            </div>
            <div>
              <span className="font-semibold text-emerald-700">Política de Cancelación:</span> {reserva.politica_cancelacion || "Cancelación totalmente reembolsable si se solicita con al menos 7 días de antelación."}
            </div>
            <div>
              <span className="font-semibold text-emerald-700">Notas:</span> {reserva.notas || "-"}
            </div>
          </div>
          <div className="space-y-3">
            {reserva.estado !== 'cancelada' && (
              <button
                className="mt-6 px-4 py-2 border border-emerald-600 text-emerald-700 rounded-xl w-full font-semibold hover:bg-emerald-50 transition"
                onClick={() => setShowCancelDialog(true)}
              >
                Solicitar cancelación de reserva
              </button>
            )}

            <button
              className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl w-full font-bold text-lg shadow"
              onClick={() => navigate('/')}
            >
              Volver
            </button>

            <button
              className="mt-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl w-full font-bold text-lg shadow"
              onClick={() => navigate(`${location.pathname}${location.search ? location.search + '&' : '?'}showFact=1`)}
            >
              Mostrar facturación
            </button>
          </div>

          {/* MÓDULO DE FACTURACIÓN */}
          {(reserva?.estado !== 'cancelada' || forceShowFact) && (
            <SeccionFacturacion reserva={reserva} />
          )}

          <Dialog open={showCancelDialog} onOpenChange={(open) => {
            if (!open && cancelSuccess) {
              setShowCancelDialog(false);
              navigate('/');
            } else {
              setShowCancelDialog(open);
            }
          }}>
            <DialogContent hideClose={cancelSuccess}>
              <DialogHeader>
                <DialogTitle>Confirmar cancelación</DialogTitle>
                <DialogDescription>
                  ¿Estás seguro de que quieres cancelar tu estancia del <strong>{reserva.fecha_entrada}</strong>?
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 text-sm">
                {diasRestantes > 7 ? (
                  <p className="text-green-700">Se procederá al reembolso íntegro de tu pago.</p>
                ) : (
                  <p className="text-red-600">Lo sentimos, según nuestra política las cancelaciones con menos de 7 días de antelación no son reembolsables.</p>
                )}
                {errorMsg && <p className="text-red-600 mt-2">{errorMsg}</p>}
                {cancelSuccess && <p className="text-green-700 mt-2">Tu reserva ha sido cancelada con éxito. Recibirás un email de confirmación en unos minutos.</p>}
              </div>

              <DialogFooter>
                {!cancelSuccess ? (
                  <>
                    <DialogClose asChild>
                      <button className="px-4 py-2 rounded-md bg-gray-100">Mantener mi reserva</button>
                    </DialogClose>
                    <Button
                      className="ml-2"
                      onClick={async () => {
                        setProcessingCancel(true);
                        setErrorMsg("");
                        try {
                          // Llamada a la Edge Function via Supabase Functions
                          const payload = { codigoReserva: reserva.codigo_reserva };
                          // Si está dentro de los 7 días, deshabilitamos el botón según petición
                          if (diasRestantes <= 7) {
                            setErrorMsg('No es posible cancelar con reembolso dentro de los 7 días.');
                            setProcessingCancel(false);
                            return;
                          }

                          const { data: fnData, error: fnError } = await supabase.functions.invoke('cancel-reservation', {
                            body: {
                              reservaId: reserva.id,
                              paymentIntentId: reserva.payment_intent_id,
                            },
                          } as any);

                          if (fnError) {
                            setErrorMsg(fnError.message || 'Error al procesar la cancelación');
                            setProcessingCancel(false);
                            return;
                          }

                          // Refrescar reserva desde la BBDD
                          const { data: refreshed } = await supabase
                            .from('reservas')
                            .select('*')
                            .eq('codigo_reserva', reserva.codigo_reserva)
                            .single();

                          if (refreshed) {
                            // mostrar mensaje de éxito en UI
                            setCancelSuccess(true);
                          }
                        } catch (err: any) {
                          setErrorMsg(err.message || 'Error inesperado');
                        } finally {
                          setProcessingCancel(false);
                        }
                      }}
                      disabled={processingCancel || diasRestantes <= 7}
                    >
                      {processingCancel ? 'Procesando...' : 'Sí, cancelar reserva'}
                    </Button>
                  </>
                ) : (
                  <button
                    className="ml-2 px-4 py-2 bg-emerald-600 text-white rounded-md"
                    onClick={() => {
                      setShowCancelDialog(false);
                      navigate('/');
                    }}
                  >
                    Volver al inicio
                  </button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// COMPONENTE ADICIONAL: SECCIÓN DE FACTURACIÓN PREMIUM
// =========================================================================
const SeccionFacturacion: React.FC<{ reserva: any }> = ({ reserva }) => {
  const [yaGenerada, setYaGenerada] = useState<boolean>(false);
  const [tipoFactura, setTipoFactura] = useState<'particular' | 'empresa'>('particular');
  const [otraPersona, setOtraPersona] = useState<boolean>(false);
  
  const [formData, setFormData] = useState({
    nombre_facturacion: reserva.cliente_nombre,
    documento: '',
    direccion: '',
    codigo_postal: '',
    ciudad: '',
    provincia: '',
    pais: 'España',
    razon_social: '',
  });

  const [cargando, setCargando] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSolicitarFactura = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);

    // Lógica para conectarse a Supabase (La configuraremos en el siguiente paso)
    setTimeout(() => {
      alert('¡Factura legal emitida y guardada con éxito en el sistema!');
      setYaGenerada(true);
      setCargando(false);
    }, 2000);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mt-6 text-left">
      <h2 className="text-xl font-serif font-bold text-emerald-900 mb-1">Facturación de la Estancia</h2>
      <p className="text-sm text-gray-500 mb-6">
        {yaGenerada 
          ? 'Tu factura ha sido emitida de forma definitiva. Puedes descargarla o solicitar su reenvío por correo.' 
          : 'Introduce los datos fiscales requeridos para generar la factura oficial de tu reserva.'}
      </p>

      {yaGenerada ? (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-emerald-900 text-sm">Factura Oficial Emitida</p>
              <p className="text-xs text-emerald-700">Estado: Guardada e inmutable</p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              type="button"
              onClick={() => window.open('#')} 
              className="flex-1 sm:flex-none px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold transition shadow-sm"
            >
              Descargar PDF
            </button>
            <button 
              type="button"
              onClick={() => alert('Reenviando factura al correo...')}
              className="flex-1 sm:flex-none px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-semibold transition"
            >
              Enviar por Email
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSolicitarFactura} className="space-y-4">
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-50 rounded-xl border border-gray-100">
            <button
              type="button"
              onClick={() => setTipoFactura('particular')}
              className={`py-2 text-xs font-bold rounded-lg transition ${tipoFactura === 'particular' ? 'bg-white text-emerald-900 shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}
            >
              Particular
            </button>
            <button
              type="button"
              onClick={() => setTipoFactura('empresa')}
              className={`py-2 text-xs font-bold rounded-lg transition ${tipoFactura === 'empresa' ? 'bg-white text-emerald-900 shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}
            >
              Empresa
            </button>
          </div>

          {tipoFactura === 'particular' ? (
            <>
              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="otraPersona"
                  checked={otraPersona}
                  onChange={(e) => {
                    setOtraPersona(e.target.checked);
                    setFormData({
                      ...formData,
                      nombre_facturacion: e.target.checked ? '' : reserva.cliente_nombre
                    });
                  }}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <label htmlFor="otraPersona" className="text-xs font-semibold text-gray-700 cursor-pointer">
                  La factura irá a nombre de otra persona
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Nombre Completo del Titular</label>
                <input
                  type="text"
                  name="nombre_facturacion"
                  value={formData.nombre_facturacion}
                  onChange={handleChange}
                  disabled={!otraPersona}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">DNI / NIE / Pasaporte</label>
                <input
                  type="text"
                  name="documento"
                  value={formData.documento}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                  placeholder="Ej: 12345678X"
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Razón Social</label>
                  <input
                    type="text"
                    name="razon_social"
                    value={formData.razon_social}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                    placeholder="Ej: Empresa S.L."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">CIF de la Empresa</label>
                  <input
                    type="text"
                    name="documento"
                    value={formData.documento}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                    placeholder="Ej: B12345678"
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-3 pt-3 border-t border-gray-100">
            <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Dirección Fiscal</p>
            
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Dirección Completa (Calle, Nº, Piso)</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                placeholder="Ej: Gran Vía, 45, 3ºB"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Código Postal</label>
                <input type="text" name="codigo_postal" value={formData.codigo_postal} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Ciudad</label>
                <input type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-semibold text-gray-500 mb-1">Provincia</label>
                <input type="text" name="provincia" value={formData.provincia} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full mt-4 bg-emerald-800 hover:bg-emerald-900 disabled:bg-gray-400 text-white font-bold text-sm py-3 rounded-xl transition shadow flex items-center justify-center gap-2"
          >
            {cargando ? 'Generando factura oficial...' : 'Solicitar mi Factura'}
          </button>
        </form>
      )}
    </div>
  );
};

export default InformacionReserva;

