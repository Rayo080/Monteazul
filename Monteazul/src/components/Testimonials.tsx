import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Mele Melero",
    text: "Experiencia espectacular. No le falta un detalle y el anfitrión siempre está pendiente. La piscina es una pasada, un pedacito de paraíso cerca de Madrid.",
    rating: 5,
  },
  {
    name: "Steven Vallejo",
    text: "Nada que envidiar a un hotel de 4 o 5 estrellas. Silencioso, bonita decoración y sobre todo resaltar la calidad de los colchones.",
    rating: 5,
  },
  {
    name: "Milena Gomero",
    text: "Súper limpio, ambientes amplios y la terraza con piscina es espectacular. Ideal para relajarse. ¡Volvería sin duda!",
    rating: 5,
  },
  {
    name: "Cristian Rustan",
    text: "Lugar impecable y zona ajardinada con vistas únicas. La atención, limpieza e instrucciones de ingreso son excelentes.",
    rating: 5,
  },
  {
    name: "Marie Moreno",
    text: "La calidad es de hotel. Todo digital, práctico y pet friendly. Viajamos con mascotas y estuvimos muy a gusto.",
    rating: 5,
  },
  {
    name: "MT P",
    text: "Lo mejor de la zona. Vinimos para una boda y está muy cerca de la finca. Casa muy limpia, tranquila y recomendable.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section id="opiniones" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-secondary font-medium text-sm uppercase tracking-widest mb-4 block">
            Opiniones
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
            Lo Que Dicen
            <br />
            <span className="italic font-normal text-muted-foreground">
              Nuestros Huéspedes
            </span>
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-accent text-accent" />
            ))}
          </div>
          <p className="text-muted-foreground text-lg">
            5.0 de valoración media en Google con más de 24 reseñas
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group bg-card p-8 rounded-lg shadow-soft hover:shadow-medium transition-all duration-300 hover-lift border border-border/50"
            >
              <Quote className="w-10 h-10 text-primary/20 mb-4" />
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-accent text-accent"
                  />
                ))}
              </div>
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              <p className="font-medium text-foreground">{testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
