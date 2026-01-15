import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Check, X, ChevronLeft, ChevronRight, Camera, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import roomImage from "@/assets/habitacionportada.png";

// Importaciones de las imágenes de la galería
import gardenImage from "@/assets/afueraporche.png";
import gardenTerrace from "@/assets/garden-terrace.jpg";
import habitacionPortada from "@/assets/habitacionportada.png";
import habitacionPortada2 from "@/assets/habitacionportada2.png";
import piscinaTumbonas from "@/assets/Piscina-Tumbonas.png";
import room1 from "@/assets/room-1.jpg";

// Importaciones de las imágenes de habitaciones
import compartida1 from "@/assets/fotohabitacioncompartida/Captura de pantalla 2026-01-02 234048.png";
import compartida2 from "@/assets/fotohabitacioncompartida/Captura de pantalla 2026-01-02 234111.png";
import compartida3 from "@/assets/fotohabitacioncompartida/Captura de pantalla 2026-01-02 234131.png";

import privada1 from "@/assets/fotohabitacionprivada/Captura de pantalla 2026-01-02 234226.png";
import privada2 from "@/assets/fotohabitacionprivada/Captura de pantalla 2026-01-02 234337.png";
import privada3 from "@/assets/fotohabitacionprivada/Captura de pantalla 2026-01-02 234355.png";
import privada4 from "@/assets/fotohabitacionprivada/Captura de pantalla 2026-01-02 234416.png";
import privada5 from "@/assets/fotohabitacionprivada/Captura de pantalla 2026-01-02 234437.png";

const features = [
  "Baño compartido / Privado (según habitación)",
  "Colchones de alta calidad hotelera",
  "Aire acondicionado individual",
  "WiFi de alta velocidad",
  "Ropa de cama premium",
  "Acceso autónomo fácil",
];

const Rooms = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);

  const photoSections = [
    {
      title: "Habitación con baño compartido",
      images: [
        { src: compartida1, alt: "Habitación con baño compartido 1" },
        { src: compartida2, alt: "Habitación con baño compartido 2" },
        { src: compartida3, alt: "Habitación con baño compartido 3" },
      ],
    },
    {
      title: "Habitación con baño privado",
      images: [
        { src: privada1, alt: "Habitación con baño privado 1" },
        { src: privada2, alt: "Habitación con baño privado 2" },
        { src: privada3, alt: "Habitación con baño privado 3" },
        { src: privada4, alt: "Habitación con baño privado 4" },
        { src: privada5, alt: "Habitación con baño privado 5" },
      ],
    },
  ];

  // Flatten all images for navigation
  const allImages = photoSections.flatMap(section => section.images);
  const currentIndex = selectedImage ? allImages.findIndex(img => img.src === selectedImage.src) : -1;

  const nextImage = () => {
    if (currentIndex < allImages.length - 1) {
      setSelectedImage(allImages[currentIndex + 1]);
    }
  };

  const prevImage = () => {
    if (currentIndex > 0) {
      setSelectedImage(allImages[currentIndex - 1]);
    }
  };

  const handleImageClick = (image: { src: string; alt: string }) => {
    setSelectedImage(image);
  };

  const closeImageView = () => {
    setSelectedImage(null);
  };

  return (
    <>
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
            <div className="relative group">
              <img
                src={roomImage}
                alt="Habitación de Hotel Monteazul"
                className="w-full h-[400px] lg:h-[500px] object-cover rounded-lg shadow-large cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setIsOpen(true)}
              />
              {/* Botón flotante para ver galería */}
              <button
                onClick={() => setIsOpen(true)}
                className="absolute top-4 left-4 bg-white/90 hover:bg-white text-foreground px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group-hover:scale-105 transform"
              >
                <Camera size={18} />
                <span className="text-sm font-medium">Ver fotos</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
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

      {/* Photo Gallery Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-lg shadow-2xl max-w-6xl max-h-[90vh] w-full mx-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-2xl font-serif font-bold text-foreground">
                  {selectedImage ? 'Vista Ampliada' : 'Ruta Fotográfica'}
                </h3>
                <button
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => {
                    if (selectedImage) {
                      closeImageView();
                    } else {
                      setIsOpen(false);
                    }
                  }}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <AnimatePresence mode="wait">
                  {selectedImage ? (
                    <motion.div
                      key="image-view"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center"
                    >
                      <div className="relative w-full h-full flex items-center justify-center">
                        <img
                          src={selectedImage.src}
                          alt={selectedImage.alt}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        {/* Navigation buttons */}
                        {currentIndex > 0 && (
                          <button
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                            onClick={prevImage}
                          >
                            <ChevronLeft size={24} />
                          </button>
                        )}
                        {currentIndex < allImages.length - 1 && (
                          <button
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                            onClick={nextImage}
                          >
                            <ChevronRight size={24} />
                          </button>
                        )}
                      </div>
                      <p className="mt-4 text-center text-muted-foreground">
                        {currentIndex + 1} de {allImages.length}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="gallery-view"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {photoSections.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="mb-8">
                          <h4 className="text-xl font-semibold text-foreground mb-4 border-b pb-2">
                            {section.title}
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {section.images.map((image, imageIndex) => (
                              <div key={imageIndex} className="relative group cursor-pointer" onClick={() => handleImageClick(image)}>
                                <img
                                  src={image.src}
                                  alt={image.alt}
                                  className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2">
                                    <span className="text-sm font-medium">Ver más grande</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Rooms;
