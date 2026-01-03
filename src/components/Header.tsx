import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React from "react";

const Header: React.FC<{ light?: boolean }> = ({ light = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { id: "experiencia", label: "Experiencia" },
    { id: "habitaciones", label: "Habitaciones" },
    { id: "servicios", label: "Servicios" },
    { id: "opiniones", label: "Opiniones" },
    { id: "ubicacion", label: "Ubicación" },
  ];

  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If on home, smooth scroll to section. Otherwise navigate to home with hash then scroll.
    if (location.pathname === "/") {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    } else {
      e.preventDefault();
      navigate(`/#${id}`);
      setIsMobileMenuOpen(false);
      // attempt to scroll after navigation (SPA timing)
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        light
          ? "bg-white/95 py-3 shadow-sm"
          : isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <span
            className={`font-serif text-2xl font-bold transition-colors duration-300 ${
              light ? "text-foreground" : isScrolled ? "text-primary" : "text-primary-foreground"
            }`}
          >
            Monteazul
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`/#${link.id}`}
              onClick={handleNavClick(link.id)}
              className={`text-sm font-medium transition-colors duration-300 hover:opacity-80 ${
                light ? "text-foreground" : isScrolled ? "text-foreground" : "text-primary-foreground"
              }`}
            >
              {link.label}
            </a>
          ))}
          <Button asChild variant={light ? "luxury" : isScrolled ? "luxury" : "hero"} size="lg">
            <Link to="/reserva">Reservar Ahora</Link>
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className={`w-6 h-6 ${light ? "text-foreground" : isScrolled ? "text-foreground" : "text-primary-foreground"}`} />
          ) : (
            <Menu className={`w-6 h-6 ${light ? "text-foreground" : isScrolled ? "text-foreground" : "text-primary-foreground"}`} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`lg:hidden absolute top-full left-0 right-0 ${light ? "bg-white/98" : "bg-background/98 backdrop-blur-lg"} shadow-lg animate-fade-in`}>
          <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`/#${link.id}`}
                className={`font-medium py-2 ${light ? "text-foreground" : "text-foreground hover:text-primary"} transition-colors`}
                onClick={handleNavClick(link.id)}
              >
                {link.label}
              </a>
            ))}
            <Button asChild variant="luxury" size="lg" className="mt-4">
              <Link to="/reserva">Reservar Ahora</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
