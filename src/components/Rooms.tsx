import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import roomImage from "@/assets/habitacionportada.png";
import { Link } from "react-router-dom";

const features = [
  "Baño compartido / Privado (según habitación)",
  "Colchones de alta calidad hotelera",
  "Aire acondicionado individual",
  "WiFi de alta velocidad",
  "Ropa de cama premium",
  "Acceso autónomo fácil",
];

const Rooms = () => {
  return (
    <section id="habitaciones" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-secondary font-medium text-sm uppercase tracking-widest mb-4 block">
            Habitaciones
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
            Confort de Hotel,
            <br />
            <span className="italic font-normal text-muted-foreground">
              Calidez de Hogar
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Habitaciones privadas diseñadas para tu máximo descanso. Cada
            espacio combina el confort de un hotel de 4 estrellas con la
            tranquilidad de un refugio en la naturaleza.
          </p>
        </div>

        {/* Room Showcase */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <img
              src={roomImage}
              alt="Habitación de Hotel Monteazul"
              className="w-full h-[400px] lg:h-[500px] object-cover rounded-lg shadow-large"
            />
            <div className="absolute top-6 right-6 bg-accent text-accent-foreground px-4 py-2 rounded-full font-medium text-sm shadow-medium">
              Mejor precio garantizado
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6">
              Lo Que Incluye Tu Estancia
            </h3>
            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-foreground"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="flex">
              <Button asChild variant="luxury" size="lg">
                <Link to="/reserva">Reservar Habitación</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Rooms;
