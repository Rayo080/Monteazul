import { Button } from "@/components/ui/button";
import { Star, PawPrint, Heart, Shield } from "lucide-react";
import heroImage from "@/assets/hero-pool.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-20">
        <div className="max-w-4xl mx-auto">
          {/* Trust Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-4 py-2 mb-8">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-accent text-accent"
                />
              ))}
            </div>
            <span className="text-primary-foreground text-sm font-medium">
              5.0 en Google · 24+ reseñas
            </span>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up-delay font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6">
            Tu Refugio Privado
            <br />
            <span className="italic font-normal">Cerca de Madrid</span>
          </h1>

          {/* Subheadline */}
          <p className="animate-fade-up-delay-2 text-primary-foreground/90 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light">
            Lujo, naturaleza y calma absoluta. Habitaciones con baño privado,
            piscina exterior y jardín en El Casar, Guadalajara.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button variant="hero" size="xl">
              Consultar Disponibilidad
            </Button>
            <Button variant="heroOutline" size="xl">
              Ver Habitaciones
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="animate-fade-up-delay-3 flex flex-wrap items-center justify-center gap-6 text-primary-foreground/80">
            <div className="flex items-center gap-2">
              <PawPrint className="w-5 h-5" />
              <span className="text-sm">Pet Friendly</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              <span className="text-sm">LGBTQ+ Friendly</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm">Cancelación Gratuita</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-primary-foreground/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
