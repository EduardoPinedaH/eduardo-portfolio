import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Reel from "@/components/Reel";
import Work from "@/components/Work";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div id="top" className="flex min-h-screen flex-1 flex-col">
      <Nav />
      <main className="flex-1">
        <Hero />
        <Reel />
        <Work />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
