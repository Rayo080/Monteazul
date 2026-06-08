import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TerminosCondiciones = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-200 bg-white/95 p-10 shadow-2xl">
          <div className="mb-10 relative pt-4">
            <div className="absolute left-0 top-0">
              <Link
                to="/"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-900 transition hover:border-slate-300 hover:bg-slate-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </div>
            <div className="text-center">
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-700">Términos y Condiciones</p>
              <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
                Hotel Monteazul
              </h1>
            </div>
          </div>

          <section className="space-y-10 text-slate-700">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">1. Información general</h2>
              <p className="leading-7 text-sm text-slate-700">
                El presente documento regula las condiciones de reserva y estancia en el Hotel Monteazul, con domicilio en Calle Isla del Hierro 286 y correo electrónico de contacto monteazulhotel@gmail.com.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">2. Reservas</h2>
              <div className="space-y-3 text-sm leading-7 text-slate-700">
                <p>Las reservas pueden realizarse a través de la página web del Hotel Monteazul.</p>
                <p>La confirmación de la reserva se enviará por correo electrónico una vez completado el proceso de pago o validación de la misma.</p>
                <p>El cliente es responsable de verificar que los datos introducidos en la reserva sean correctos.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">3. Precios y pagos</h2>
              <div className="space-y-3 text-sm leading-7 text-slate-700">
                <p>Los precios mostrados en la web incluyen los impuestos aplicables, salvo que se indique lo contrario.</p>
                <p>El pago se realiza mediante plataforma segura Stripe.</p>
                <p>En cada reserva se incluye una tasa de gestión no reembolsable del 4% del importe total.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">4. Cancelaciones y reembolsos</h2>
              <div className="space-y-3 text-sm leading-7 text-slate-700">
                <p>El Hotel Monteazul ofrece cancelación gratuita hasta la fecha indicada en la reserva.</p>
                <p>Si la cancelación se realiza dentro del periodo gratuito, se reembolsará el importe correspondiente, excepto la tasa de gestión.</p>
                <p>Fuera de este periodo, el hotel se reserva el derecho de no reembolsar el importe de la reserva.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">5. Normas sobre mascotas</h2>
              <div className="space-y-3 text-sm leading-7 text-slate-700">
                <p>Se permite la estancia de mascotas con un cargo adicional por día y mascota.</p>
                <p>El cliente deberá garantizar que cada mascota dispone de su propia jaula o transportín adecuado.</p>
                <p>El hotel se reserva el derecho de admisión en caso de comportamiento inadecuado o incumplimiento de las normas.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">6. Ocupación y normas de estancia</h2>
              <div className="space-y-3 text-sm leading-7 text-slate-700">
                <p>Cada habitación tiene un límite máximo de ocupación indicado en el proceso de reserva.</p>
                <p>No se permite superar el número de huéspedes indicado sin autorización previa del hotel.</p>
                <p>El cliente deberá respetar las normas internas del establecimiento durante su estancia.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">7. Check-in y check-out</h2>
              <div className="space-y-3 text-sm leading-7 text-slate-700">
                <p>El horario de check-in y check-out será el establecido por el hotel y comunicado en el momento de la reserva.</p>
                <p>Las llegadas fuera del horario previsto de check-in deberán ser notificadas con antelación y podrán estar sujetas a confirmación por parte del establecimiento.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">8. Responsabilidad</h2>
              <div className="space-y-3 text-sm leading-7 text-slate-700">
                <p>El hotel no se hace responsable de:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Pérdida o robo de objetos personales dentro de las habitaciones</li>
                  <li>Daños causados por el uso indebido de las instalaciones por parte del cliente</li>
                  <li>Retrasos o fallos en servicios externos (transporte, pagos, etc.)</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">9. Protección de datos</h2>
              <p className="leading-7 text-sm text-slate-700">
                El tratamiento de los datos personales se realiza conforme al Reglamento General de Protección de Datos (RGPD), tal como se indica en la Política de Privacidad del Hotel Monteazul.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">10. Contacto</h2>
              <p className="leading-7 text-sm text-slate-700">
                Para cualquier duda relacionada con estos términos y condiciones, el usuario puede contactar en: <span className="font-medium text-emerald-700">monteazulhotel@gmail.com</span>
              </p>
            </div>
          </section>

          <div className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-600">
            <p>
              Esta página describe los términos y condiciones aplicables a las reservas y estancias en Hotel Monteazul.
            </p>
            <Link
              to="/"
              className="inline-flex mt-6 rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TerminosCondiciones;
