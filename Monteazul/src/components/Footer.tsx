import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4">Monteazul</h3>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
              Tu refugio privado cerca de Madrid. Lujo, naturaleza y tranquilidad
              absoluta en El Casar, Guadalajara.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-medium mb-4">Descubre</h4>
            <ul className="space-y-3 text-primary-foreground/70 text-sm">
              <li>
                <a href="#experiencia" className="hover:text-primary-foreground transition-colors">
                  Experiencia
                </a>
              </li>
              <li>
                <a href="#habitaciones" className="hover:text-primary-foreground transition-colors">
                  Habitaciones
                </a>
              </li>
              <li>
                <a href="#servicios" className="hover:text-primary-foreground transition-colors">
                  Servicios
                </a>
              </li>
              <li>
                <a href="#opiniones" className="hover:text-primary-foreground transition-colors">
                  Opiniones
                </a>
              </li>
              <li>
                <Link to="/gestion-monteazul" className="hover:text-primary-foreground transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-medium mb-4">Contacto</h4>
            <ul className="space-y-3 text-primary-foreground/70 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  C. Isla del Hierro, 286
                  <br />
                  19170 El Casar, Guadalajara
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="tel:+34651391228" className="hover:text-primary-foreground transition-colors">
                  +34 651 39 12 28
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a
                  href="mailto:hola@hotelmonteazul.com"
                  className="hover:text-primary-foreground transition-colors"
                >
                  hola@hotelmonteazul.com
                </a>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-medium mb-4">Información</h4>
            <ul className="space-y-3 text-primary-foreground/70 text-sm">
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors">
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors">
                  Política de Cancelación
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors">
                  Preguntas Frecuentes
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center text-primary-foreground/50 text-sm">
          <p>© 2024 Hotel Monteazul. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
