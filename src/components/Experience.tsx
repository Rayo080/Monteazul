import gardenImage from "@/assets/afueraporche.png";

const Experience = () => {
  return (
    <section id="experiencia" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            <span className="text-secondary font-medium text-sm uppercase tracking-widest mb-4 block">
              La Experiencia
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
              Un Paraíso Escondido
              <br />
              <span className="italic font-normal text-muted-foreground">
                a Minutos de Madrid
              </span>
            </h2>
            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
              <p>
                Despierta con el canto de los pájaros. Siente la brisa suave del
                campo castellano. Sumérgete en la calma de la piscina bajo el
                último sol del atardecer.
              </p>
              <p>
                Hotel Monteazul no es solo un lugar donde dormir. Es un refugio
                donde el tiempo se detiene, donde cada detalle está pensado para
                tu descanso absoluto.
              </p>
              <p className="font-medium text-foreground">
                Silencio. Aire puro. Descanso profundo.
                <br />
                La sensación de estar cuidado.
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              <img
                src={gardenImage}
                alt="Terraza y jardín de Hotel Monteazul al atardecer"
                className="w-full h-[400px] lg:h-[500px] object-cover rounded-lg shadow-large"
              />
              <div className="absolute -bottom-4 -left-4 bg-primary text-primary-foreground p-3 rounded-lg shadow-medium hidden sm:block">
                <p className="font-serif text-xl font-semibold">Tu Refugio de Confianza</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
