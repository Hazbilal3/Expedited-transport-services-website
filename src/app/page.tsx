import { SiteHeader } from "@/components/SiteHeader";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { ScrollFrameSection } from "@/components/ScrollFrameSection";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <div style={{ position: "relative", zIndex: 1 }}>
          <HeroSection />
        </div>
        <div style={{
          position: "relative",
          zIndex: 2,
          marginTop: "-60px",
          backgroundColor: "#fff",
        }}>
          <FeaturesSection />
        </div>
        <div style={{ position: "relative", zIndex: 3 }}>
          <ScrollFrameSection />
        </div>
      </main>
    </>
  );
}
