import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Camera, ArrowRight } from 'lucide-react';
import gardenImage from "@/assets/afueraporche.png";
import gardenTerrace from "@/assets/garden-terrace.jpg";
import habitacionPortada from "@/assets/habitacionportada.png";
import habitacionPortada2 from "@/assets/habitacionportada2.png";
import piscinaTumbonas from "@/assets/Piscina-Tumbonas.png";
import room1 from "@/assets/room-1.jpg";

// Importaciones de las nuevas imágenes de Experienciaftos
// Pasillo
import pasillo1 from "@/assets/Experienciaftos/Pasillo/166217e8-19d7-4e92-9cf6-8509bfb00e02.avif";
import pasillo2 from "@/assets/Experienciaftos/Pasillo/54fea7f5-9e14-40bc-adac-7f1641b199a6.avif";
import pasillo3 from "@/assets/Experienciaftos/Pasillo/a4d6c8d3-6d04-4c74-aeeb-e21be0b504b0.avif";
import pasillo4 from "@/assets/Experienciaftos/Pasillo/c4d7873e-bbee-4bcc-a072-3c48fd072559.jpg";

// Cocina
import cocina1 from "@/assets/Experienciaftos/Cocina/34f22817-119f-44bc-a235-5402a8509d2a.avif";
import cocina2 from "@/assets/Experienciaftos/Cocina/626b4a55-539e-4aa8-b3d0-dd41f8289730.avif";

// Aseo
import aseo1 from "@/assets/Experienciaftos/Aseo/4aa0b58e-9532-460b-9aa9-f3d64ad9a658.avif";
import aseo2 from "@/assets/Experienciaftos/Aseo/a3bfad9e-07e6-4682-a2aa-2660ae2530c1.avif";
import aseo3 from "@/assets/Experienciaftos/Aseo/ffa68642-3b53-416f-8016-30941ef0cf3a.avif";

// Exterior
import exterior1 from "@/assets/Experienciaftos/Exterior/19ba6f53-7b90-4e31-b653-c58c81348e64.avif";
import exterior2 from "@/assets/Experienciaftos/Exterior/68201ca3-3a67-4b63-b50c-467a796d8cbf.avif";
import exterior3 from "@/assets/Experienciaftos/Exterior/91a85137-2020-41d1-8ce8-831c20757ab7.avif";
import exterior4 from "@/assets/Experienciaftos/Exterior/93b204b9-49c1-41f6-be6b-21c2c3c1f6fa.avif";
import exterior5 from "@/assets/Experienciaftos/Exterior/97de96d1-60d8-454b-9e60-31db8d48ddb4.avif";
import exterior6 from "@/assets/Experienciaftos/Exterior/d4188e85-1f0e-48c4-806f-9c26b6124c4d.avif";

// Patio
import patio1 from "@/assets/Experienciaftos/Patio/33345bd7-e407-405e-ab84-e332c87d735b.jpg";
import patio2 from "@/assets/Experienciaftos/Patio/39a7a504-b0bb-46c2-89f0-06c35e24d545.jpg";
import patio3 from "@/assets/Experienciaftos/Patio/4f467c05-3126-4716-b6f0-8702a6e80fe7.avif";
import patio4 from "@/assets/Experienciaftos/Patio/60237090-86e4-4490-a5ae-3a89bb24f29a.jpg";
import patio5 from "@/assets/Experienciaftos/Patio/74fde5eb-7230-41b0-a071-134b88dd72bb.avif";
import patio6 from "@/assets/Experienciaftos/Patio/76f1f9f2-701f-452e-9ac6-f31ea12b505a.avif";
import patio7 from "@/assets/Experienciaftos/Patio/91a85137-2020-41d1-8ce8-831c20757ab7.avif";
import patio8 from "@/assets/Experienciaftos/Patio/99d7d6a4-13b9-4cdd-a173-b408a2636453.avif";
import patio9 from "@/assets/Experienciaftos/Patio/a53201e9-987f-4ea5-9331-dd0e001181ab.jpg";
import patio10 from "@/assets/Experienciaftos/Patio/ad86b1ef-99a7-4bc2-a569-b73365aa4bb1.jpg";
import patio11 from "@/assets/Experienciaftos/Patio/b2910af6-9149-4f49-ae31-76dc5dd5a0c7.jpg";
import patio12 from "@/assets/Experienciaftos/Patio/b86ce8f8-13be-4e40-a403-b00227f91812.avif";
import patio13 from "@/assets/Experienciaftos/Patio/d7a050d0-8313-4703-acd0-c40955c20ba4.jpg";
import patio14 from "@/assets/Experienciaftos/Patio/dbb5ea53-4e53-467e-83b2-2b773f1a347b.avif";
import patio15 from "@/assets/Experienciaftos/Patio/f444cc2d-eca5-44f7-89a4-e7db553bdb81.avif";
import patio16 from "@/assets/Experienciaftos/Patio/fd05deaf-2205-4bbe-95b9-24014ae9788d.jpg";
import patio17 from "@/assets/Experienciaftos/Patio/feba5432-c701-4fdc-a560-72f0eb76e5bf.avif";

// Alrededores
import alrededores1 from "@/assets/Experienciaftos/Alrededores/05d9a7d3-83b4-4b5b-97f9-44841e04400d.avif";
import alrededores2 from "@/assets/Experienciaftos/Alrededores/07eeb19d-d412-43ba-bbc9-855d8d4862fa.jpg";
import alrededores3 from "@/assets/Experienciaftos/Alrededores/18538662-536a-4253-8d17-48085cdea61d.avif";
import alrededores4 from "@/assets/Experienciaftos/Alrededores/1ad4a4d9-840a-4eed-939f-dad88b55258c.avif";
import alrededores5 from "@/assets/Experienciaftos/Alrededores/21696830-9508-4e6d-826a-95bf7ba85be5.jpg";
import alrededores6 from "@/assets/Experienciaftos/Alrededores/385cb034-22bd-4a09-ab43-fa3ac1da5c85.avif";
import alrededores7 from "@/assets/Experienciaftos/Alrededores/48fb6d23-c8a0-423d-a510-ea7abae140d0.avif";
import alrededores8 from "@/assets/Experienciaftos/Alrededores/4b3c9478-22a1-4591-b931-9c876f4bf252.avif";
import alrededores9 from "@/assets/Experienciaftos/Alrededores/54f41d05-1863-47bf-b511-bdfa6c8efec2.jpg";
import alrededores10 from "@/assets/Experienciaftos/Alrededores/6565f300-6a27-40b3-8efe-e1220ace6284.avif";
import alrededores11 from "@/assets/Experienciaftos/Alrededores/749af8eb-a135-45a1-9fa6-5dca621b4978.avif";
import alrededores12 from "@/assets/Experienciaftos/Alrededores/8f4e4f4a-6ffa-4422-803c-d807c37df4f8.avif";
import alrededores13 from "@/assets/Experienciaftos/Alrededores/a1403d33-7fda-430e-b224-3b8e44cf29b7.avif";
import alrededores14 from "@/assets/Experienciaftos/Alrededores/ad2cb87e-21ab-4b89-8d23-0bb8da23fe5a.avif";
import alrededores15 from "@/assets/Experienciaftos/Alrededores/bf9aa4d8-6991-498b-b7db-774defaeee44.avif";
import alrededores16 from "@/assets/Experienciaftos/Alrededores/cf71ca45-781f-4cb5-ba8c-b2d35c84adb7.avif";
import alrededores17 from "@/assets/Experienciaftos/Alrededores/d2bb6ee8-c996-4c0e-8690-f74aa9be308d.avif";
import alrededores18 from "@/assets/Experienciaftos/Alrededores/d37d2445-7541-4b9a-b4a2-692ca871fa03.jpg";
import alrededores19 from "@/assets/Experienciaftos/Alrededores/e0cfe8cc-79e1-4c56-ab58-f00014094d1d.avif";
import alrededores20 from "@/assets/Experienciaftos/Alrededores/e8ff5691-1789-499e-a15f-856df8c52d7f.avif";
import alrededores21 from "@/assets/Experienciaftos/Alrededores/efee372b-3186-4a40-a02f-7e40d94572d1.jpg";
import alrededores22 from "@/assets/Experienciaftos/Alrededores/ffd5dfb7-042f-41ab-bdb4-bfd4c2e2f6e2.avif";

const Experience = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);

  const photoSections = [
    {
      title: "Pasillo de Entrada",
      images: [
        { src: pasillo1, alt: "Pasillo de entrada 1" },
        { src: pasillo2, alt: "Pasillo de entrada 2" },
        { src: pasillo3, alt: "Pasillo de entrada 3" },
        { src: pasillo4, alt: "Pasillo de entrada 4" },
      ],
    },
    {
      title: "Cocina Completa",
      images: [
        { src: cocina1, alt: "Cocina completa 1" },
        { src: cocina2, alt: "Cocina completa 2" },
      ],
    },
    {
      title: "Aseo",
      images: [
        { src: aseo1, alt: "Aseo 1" },
        { src: aseo2, alt: "Aseo 2" },
        { src: aseo3, alt: "Aseo 3" },
      ],
    },
    {
      title: "Patio",
      images: [
        { src: patio1, alt: "Patio 1" },
        { src: patio2, alt: "Patio 2" },
        { src: patio3, alt: "Patio 3" },
        { src: patio4, alt: "Patio 4" },
        { src: patio5, alt: "Patio 5" },
        { src: patio6, alt: "Patio 6" },
        { src: patio7, alt: "Patio 7" },
        { src: patio8, alt: "Patio 8" },
        { src: patio9, alt: "Patio 9" },
        { src: patio10, alt: "Patio 10" },
        { src: patio11, alt: "Patio 11" },
        { src: patio12, alt: "Patio 12" },
        { src: patio13, alt: "Patio 13" },
        { src: patio14, alt: "Patio 14" },
        { src: patio15, alt: "Patio 15" },
        { src: patio16, alt: "Patio 16" },
        { src: patio17, alt: "Patio 17" },
      ],
    },
    {
      title: "Exterior",
      images: [
        { src: exterior1, alt: "Exterior 1" },
        { src: exterior2, alt: "Exterior 2" },
        { src: exterior3, alt: "Exterior 3" },
        { src: exterior4, alt: "Exterior 4" },
        { src: exterior5, alt: "Exterior 5" },
        { src: exterior6, alt: "Exterior 6" },
      ],
    },
    {
      title: "Alrededores",
      images: [
        { src: alrededores1, alt: "Alrededores 1" },
        { src: alrededores2, alt: "Alrededores 2" },
        { src: alrededores3, alt: "Alrededores 3" },
        { src: alrededores4, alt: "Alrededores 4" },
        { src: alrededores5, alt: "Alrededores 5" },
        { src: alrededores6, alt: "Alrededores 6" },
        { src: alrededores7, alt: "Alrededores 7" },
        { src: alrededores8, alt: "Alrededores 8" },
        { src: alrededores9, alt: "Alrededores 9" },
        { src: alrededores10, alt: "Alrededores 10" },
        { src: alrededores11, alt: "Alrededores 11" },
        { src: alrededores12, alt: "Alrededores 12" },
        { src: alrededores13, alt: "Alrededores 13" },
        { src: alrededores14, alt: "Alrededores 14" },
        { src: alrededores15, alt: "Alrededores 15" },
        { src: alrededores16, alt: "Alrededores 16" },
        { src: alrededores17, alt: "Alrededores 17" },
        { src: alrededores18, alt: "Alrededores 18" },
        { src: alrededores19, alt: "Alrededores 19" },
        { src: alrededores20, alt: "Alrededores 20" },
        { src: alrededores21, alt: "Alrededores 21" },
        { src: alrededores22, alt: "Alrededores 22" },
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
              <div className="relative group">
                <img
                  src={gardenImage}
                  alt="Terraza y jardín de Hotel Monteazul al atardecer"
                  className="w-full h-[400px] lg:h-[500px] object-cover rounded-lg shadow-large cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setIsOpen(true)}
                />
                {/* Botón flotante para ver galería */}
                <button
                  onClick={() => setIsOpen(true)}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white text-foreground px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group-hover:scale-105 transform"
                >
                  <Camera size={18} />
                  <span className="text-sm font-medium">Ver fotos</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="absolute -bottom-4 -left-4 bg-primary text-primary-foreground p-3 rounded-lg shadow-medium hidden sm:block">
                  <p className="font-serif text-xl font-semibold">Tu Refugio de Confianza</p>
                </div>
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

export default Experience;
