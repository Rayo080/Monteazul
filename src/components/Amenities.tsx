import {
  Waves,
  TreePine,
  Wifi,
  Car,
  PawPrint,
  Wind,
  Plane,
  Accessibility,
  UtensilsCrossed,
  Volume2,
} from "lucide-react";

const amenities = [
  { icon: Waves, label: "Piscina Exterior", description: "Agua cristalina" },
  { icon: TreePine, label: "Jardín y Terraza", description: "Zona de relax" },
  { icon: Wifi, label: "WiFi Gratis", description: "Alta velocidad" },
  { icon: Car, label: "Parking Gratuito", description: "Amplio y seguro" },
  { icon: PawPrint, label: "Pet Friendly", description: "Mascotas bienvenidas" },
  { icon: Wind, label: "Aire Acondicionado", description: "Clima perfecto" },
  { icon: Plane, label: "Traslado Aeropuerto", description: "Bajo petición" },
  {
    icon: Accessibility,
    label: "Acceso Adaptado",
    description: "Silla de ruedas",
  },
  {
    icon: UtensilsCrossed,
    label: "Cocina Compartida",
    description: "Totalmente equipada",
  },
  { icon: Volume2, label: "Ambiente Tranquilo", description: "Total privacidad" },
];

const Amenities = () => {
  return (
    <section id="servicios" className="py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-accent font-medium text-sm uppercase tracking-widest mb-4 block">
            Servicios
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            Todo Lo Que Necesitas,
            <br />
            <span className="italic font-normal opacity-80">
              Nada Que Te Sobre
            </span>
          </h2>
          <p className="text-primary-foreground/80 text-lg">
            Hemos pensado en cada detalle para que tu única preocupación sea
            descansar.
          </p>
        </div>

        {/* Amenities Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
          {amenities.map((amenity, index) => (
            <div
              key={index}
              className="group text-center p-6 rounded-lg bg-primary-foreground/5 hover:bg-primary-foreground/10 transition-all duration-300 hover-lift"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary-foreground/10 flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300">
                <amenity.icon className="w-7 h-7" />
              </div>
              <h3 className="font-medium text-sm mb-1">{amenity.label}</h3>
              <p className="text-xs text-primary-foreground/60">
                {amenity.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Amenities;
