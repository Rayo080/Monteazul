import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PoliticaCancelacion = () => {
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
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-700">Política de Cancelación</p>
              <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
                Hotel Monteazul
              </h1>
            </div>
          </div>

          <section className="space-y-10 text-slate-700">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">1. Plazo de cancelación gratuita</h2>
              <div className="space-y-3 text-sm leading-7 text-slate-700">
                <p>Las reservas podrán cancelarse sin coste hasta 7 días antes de la fecha de entrada, siempre que la reserva haya sido realizada con dicha antelación.</p>
                <p>Ejemplo:</p>
                <p className="pl-4">Si la fecha de llegada es el 21 de mayo, la cancelación gratuita estará disponible hasta el 14 de mayo a las 23:59 horas.</p>
                <p className="pl-4">A partir del 15 de mayo a las 00:00 horas, la reserva ya no podrá cancelarse de forma gratuita.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">2. Condiciones según la antelación de la reserva</h2>
              <div className="space-y-3 text-sm leading-7 text-slate-700">
                <p>Las reservas realizadas con 7 o más días de antelación a la fecha de entrada podrán cancelarse de forma gratuita dentro del plazo indicado.</p>
                <p>Las reservas realizadas con menos de 7 días de antelación a la fecha de entrada serán consideradas no reembolsables, no permitiéndose cancelación ni reembolso del importe abonado.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">3. Reembolso en caso de cancelación</h2>
              <div className="space-y-3 text-sm leading-7 text-slate-700">
                <p>En los casos en los que la cancelación se realice dentro del plazo permitido, se reembolsará el importe total de la reserva.</p>
                <p>La tasa de gestión no será reembolsable en ningún caso.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">4. Cancelaciones fuera de plazo</h2>
              <p className="leading-7 text-sm text-slate-700">Si la cancelación se realiza una vez superado el plazo de cancelación gratuita, no se efectuará ningún reembolso.</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">5. Cómo cancelar una reserva</h2>
              <p className="leading-7 text-sm text-slate-700">Las cancelaciones deberán realizarse a través del sistema de gestión de reservas, introduciendo el código de reserva y el correo electrónico asociado.</p>
            </div>
          </section>

          <div className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-600">
            <p>
              Esta política de privacidad está diseñada para ofrecer claridad y confianza en el tratamiento de tus datos personales durante tu experiencia con Hotel Monteazul.
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

export default PoliticaCancelacion;
