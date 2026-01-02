import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Rooms from "@/components/Rooms";
import Amenities from "@/components/Amenities";
import Testimonials from "@/components/Testimonials";
import Location from "@/components/Location";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
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
