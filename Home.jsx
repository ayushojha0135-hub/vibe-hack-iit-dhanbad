import { Header } from "@/sections/Header";
import { Hero } from "@/sections/Hero";
import { Marquee } from "@/sections/Marquee";
import { TreasureMap } from "@/sections/TreasureMap";
import { Voyage } from "@/sections/Voyage";
import { Council } from "@/sections/Council";
import { Islands } from "@/sections/Islands";
import { Vault } from "@/sections/Vault";
import { Fleet } from "@/sections/Fleet";
import { Footer } from "@/sections/Footer";
import { MobileNav } from "@/sections/MobileNav";
import { Parrot } from "@/components/Parrot";

export default function HomePage() {
  return (
    <>
      <Header />
      <main data-shake className="relative">
        <Hero />
        <Marquee />
        <TreasureMap />
        <Voyage />
        <Council />
        <Islands />
        <Vault />
        <Fleet />
        <Footer />
      </main>
      <MobileNav />
      <Parrot />
    </>
  );
}
