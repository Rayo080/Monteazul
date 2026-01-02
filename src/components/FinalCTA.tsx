import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const benefits = [
  "Cancelación gratuita",
  "Mejor precio garantizado",
  "Confirmación inmediata",
];

const FinalCTA = () => {
  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            Una Vez Que Llegues,
            <br />
            <span className="italic font-normal opacity-80">
              No Querrás Irte
            </span>
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
            Reserva directamente y disfruta de las mejores condiciones. Tu
            refugio de paz te espera.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                  <Check className="w-3 h-3 text-accent-foreground" />
                </div>
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl">
              Consultar Disponibilidad
            </Button>
            <Button variant="heroOutline" size="xl">
              Reservar Ahora
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
