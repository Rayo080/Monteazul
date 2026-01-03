import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Rooms from "@/components/Rooms";
import Amenities from "@/components/Amenities";
import Testimonials from "@/components/Testimonials";
import Location from "@/components/Location";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyRound, Mail } from "lucide-react";

function BuscadorReservaInicio() {
  const [codigo, setCodigo] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const handleBuscar = async () => {
    if (!codigo || !email) {
      setError("Introduce el código y el email");
      return;
    }
    setError("");
    setLoading(true);
    const { data, error } = await supabase
      .from("reservas")
      .select("*")
      .eq("codigo_reserva", codigo.trim().toUpperCase())
      .eq("email", email.trim().toLowerCase())
      .single();
    setLoading(false);
    if (error || !data) {
      setError("No se encontró ninguna reserva con esos datos.");
      return;
    }
    navigate("/informacion-reserva", { state: { reserva: data } });
  };

  return (
    <section className="relative min-h-[400px] flex items-center justify-center bg-cover bg-center pt-12 pb-4 mt-8" style={{backgroundImage: "url('/assets/afuera/piscina.jpg')"}}>
      <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl max-w-2xl w-full mx-4 border border-white/20">
        <h2 className="text-[#2D5A27] font-serif text-3xl md:text-4xl text-center mb-2 tracking-tight">Gestiona tu Reserva</h2>
        <p className="text-gray-600 text-center mb-8 text-sm uppercase tracking-widest">Revisa los detalles de tu estancia en Monteazul</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Input
              value={codigo}
              onChange={e => setCodigo(e.target.value)}
              placeholder="Código (Ej: MTZ-BR7H7Y)"
              className="p-4 pl-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2D5A27] outline-none transition-all text-lg"
            />
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-700" size={22} />
          </div>
          <div className="relative">
            <Input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Tu Email"
              type="email"
              className="p-4 pl-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2D5A27] outline-none transition-all text-lg"
            />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-700" size={22} />
          </div>
        </div>
        <Button onClick={handleBuscar} disabled={loading} className="w-full mt-6 bg-[#2D5A27] text-white font-bold py-4 rounded-xl hover:bg-[#1f3f1b] transition-colors shadow-lg text-lg tracking-widest uppercase">
          {loading ? "Consultando..." : "Consultar Reserva"}
        </Button>
        {error && <div className="mt-2 text-red-600 text-sm text-center">{error}</div>}
      </div>
    </section>
  );
}

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <BuscadorReservaInicio />
        <Experience />
        <Rooms />
        <Amenities />
        <Testimonials />
        <Location />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
