import React, { useState } from "react";
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
  const reserva = location.state?.reserva;
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [processingCancel, setProcessingCancel] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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

  if (!reserva) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Reserva no encontrada</h2>
        <button
          className="px-4 py-2 bg-primary text-white rounded"
          onClick={() => navigate("/mi-reserva")}
        >
          Volver a buscar
        </button>
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
          </div>

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

export default InformacionReserva;
