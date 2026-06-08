import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PoliticaPrivacidad = () => {
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
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-700">Política de Privacidad</p>
              <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
                Hotel Monteazul
              </h1>
            </div>
          </div>

          <section className="space-y-10 text-slate-700">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">1. Responsable del tratamiento</h2>
              <div className="space-y-1 text-sm leading-7">
                <p>Hotel Monteazul</p>
                <p>Calle Isla del Hierro 286</p>
                <p>
                  Email de contacto: <a href="mailto:monteazulhotel@gmail.com" className="font-medium text-emerald-700 hover:text-emerald-900">monteazulhotel@gmail.com</a>
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">2. Finalidad del tratamiento de los datos</h2>
              <p className="leading-7">
                Los datos personales facilitados por los usuarios a través de la página web se utilizan para:
              </p>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700">
                <li>Gestionar reservas de alojamiento.</li>
                <li>Enviar confirmaciones de reserva por correo electrónico.</li>
                <li>Atender solicitudes de información o contacto.</li>
                <li>Gestionar la facturación y obligaciones administrativas derivadas del servicio.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">3. Datos personales que se recogen</h2>
              <p className="leading-7">
                A través del sistema de reservas se pueden recoger los siguientes datos:
              </p>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700">
                <li>Nombre y apellidos</li>
                <li>Correo electrónico</li>
                <li>Teléfono</li>
                <li>Fechas de estancia</li>
                <li>Número de huéspedes</li>
                <li>Información sobre mascotas (si aplica)</li>
                <li>Hora estimada de llegada</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">4. Base legal del tratamiento</h2>
              <p className="leading-7">
                El tratamiento de los datos se basa en:
              </p>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700">
                <li>La ejecución de un contrato, ya que los datos son necesarios para gestionar la reserva de alojamiento.</li>
                <li>El consentimiento del usuario, al completar los formularios de reserva o contacto.</li>
                <li>El cumplimiento de obligaciones legales en materia fiscal, contable y de registro de huéspedes.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">5. Conservación de los datos</h2>
              <p className="leading-7 text-sm text-slate-700">
                Los datos personales se conservarán durante el tiempo necesario para gestionar la reserva y la estancia del cliente. Posteriormente, se conservarán durante los plazos legalmente exigidos por la normativa fiscal y contable aplicable, que habitualmente es de hasta 5 años.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">6. Comunicación de datos a terceros</h2>
              <p className="leading-7 text-sm text-slate-700">
                Los datos no se cederán a terceros, salvo en los siguientes casos:
              </p>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700">
                <li>Entidades bancarias y pasarelas de pago (Stripe) para la gestión de pagos.</li>
                <li>Proveedores tecnológicos necesarios para el funcionamiento de la web y el sistema de reservas.</li>
                <li>Administraciones públicas cuando exista obligación legal.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">7. Derechos de los usuarios</h2>
              <p className="leading-7 text-sm text-slate-700">
                El usuario puede ejercer en cualquier momento los siguientes derechos:
              </p>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700">
                <li>Acceso a sus datos personales</li>
                <li>Rectificación de datos incorrectos</li>
                <li>Supresión de sus datos</li>
                <li>Oposición al tratamiento</li>
                <li>Limitación del tratamiento</li>
                <li>Portabilidad de los datos</li>
              </ul>
              <p className="leading-7 text-sm text-slate-700">
                Para ejercer estos derechos, el usuario puede enviar un correo electrónico a: <span className="font-medium text-emerald-700">monteazulhotel@gmail.com</span>
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">8. Seguridad de los datos</h2>
              <p className="leading-7 text-sm text-slate-700">
                El Hotel Monteazul aplica medidas técnicas y organizativas adecuadas para garantizar la seguridad de los datos personales, evitando su pérdida, alteración o acceso no autorizado.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">9. Cookies</h2>
              <p className="leading-7 text-sm text-slate-700">
                Este sitio web no utiliza cookies de análisis ni de publicidad. Únicamente pueden utilizarse cookies técnicas necesarias para el correcto funcionamiento del sistema de reservas.
              </p>
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

export default PoliticaPrivacidad;
