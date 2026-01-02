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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3026.432!2d-3.3844!3d40.6953!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQxJzQzLjEiTiAzwrAyMycwNC4wIlc!5e0!3m2!1ses!2ses!4v1699999999999!5m2!1ses!2ses"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de Hotel Monteazul"
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
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="luxury" size="lg">
                Cómo Llegar
              </Button>
              <Button variant="outline" size="lg">
                Traslado Aeropuerto
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;
