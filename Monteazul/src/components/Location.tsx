import { Button } from "@/components/ui/button";
import { MapPin, Clock, Car } from "lucide-react";

const Location = () => {
  return (
    <section id="ubicacion" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Map Placeholder */}
          <div className="order-2 lg:order-1">
            <div className="relative rounded-lg overflow-hidden shadow-large h-[400px] lg:h-[500px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3025.2921028751334!2d-3.45154192342533!3d40.6943269389477!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd4389bae6c78a0d%3A0xaf516f30570110a3!2sHabitacion%20Monteazul!5e0!3m2!1ses!2ses!4v1714674000000!5m2!1ses!2ses"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: "15px" }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de Habitacion Monteazul"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="order-1 lg:order-2">
            <span className="text-secondary font-medium text-sm uppercase tracking-widest mb-4 block">
              Ubicación
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
              Cerca de Todo,
              <br />
              <span className="italic font-normal text-muted-foreground">
                Lejos del Ruido
              </span>
            </h2>
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">Dirección</h3>
                  <p className="text-muted-foreground">
                    C. Isla del Hierro, 286
                    <br />
                    19170 El Casar, Guadalajara
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    Desde Madrid
                  </h3>
                  <p className="text-muted-foreground">
                    Solo 35 minutos en coche desde el centro
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Car className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    Ideal Para
                  </h3>
                  <p className="text-muted-foreground">
                    Bodas y eventos en la zona, escapadas románticas, teletrabajo
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="luxury" size="lg">
                <a
                  href="https://maps.google.com/?q=Habitacion+Monteazul+C.+Isla+del+Hierro,+286,+19170+El+Casar,+Guadalajara"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cómo Llegar
                </a>
              </Button>
            </div>

            {/* Airport transfer info block (placed below the 'Cómo Llegar' button) */}
            <div className="mt-6 p-6 rounded-lg bg-primary-foreground/5 border border-border/50">
              <h3 className="font-medium text-lg text-foreground mb-2">Servicio de Traslado al Aeropuerto</h3>
              <p className="text-muted-foreground mb-4">
                ¿Necesitas que te recojamos o te llevemos al aeropuerto? Ofrecemos servicio personalizado bajo petición para que tu única preocupación sea disfrutar.
              </p>
              <div>
                <a
                  href="https://wa.me/34651391228?text=Hola%2C%20me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20servicio%20de%20traslado%20al%20aeropuerto"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-md font-medium shadow-md hover:shadow-lg">
                    Consultar Tarifas y Horarios
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;
