import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "María García",
    text: "No le falta nada, todo perfecto. Parece un hotel de 4-5 estrellas. La limpieza es impecable y Rubén siempre está atento a todo.",
    rating: 5,
  },
  {
    name: "Carlos Rodríguez",
    text: "Paz, tranquilidad, un paraíso. La piscina y el jardín son increíbles. Perfecto para desconectar del estrés de Madrid.",
    rating: 5,
  },
  {
    name: "Ana Martínez",
    text: "Vinimos por una boda cercana y fue la mejor decisión. Las habitaciones son muy cómodas y el ambiente es precioso.",
    rating: 5,
  },
  {
    name: "David & Miguel",
    text: "Como pareja nos sentimos muy bienvenidos. El lugar es precioso, tranquilo y con todas las comodidades. Volveremos seguro.",
    rating: 5,
  },
  {
    name: "Laura Fernández",
    text: "Viajamos con nuestro perro y fue genial. Muy pet-friendly, con espacio para que corra. Limpieza excepcional.",
    rating: 5,
  },
  {
    name: "Pedro Sánchez",
    text: "Como nómada digital necesitaba WiFi estable y tranquilidad para trabajar. Lo encontré todo aquí. La piscina después del trabajo es un lujo.",
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
