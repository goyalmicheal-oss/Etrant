import CTABanner from "@/components/home/cta-banner";
import FeaturesGrid from "@/components/home/features-grid";
import HeroSection from "@/components/home/hero-section";
import Navbar from "@/components/home/navbar";
import ProcessFlow from "@/components/home/process-flow";
// import StatsSection from "@/components/home/stats-section";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import Footer from "@/components/home/footer";

export default function LandingPage() {
  return (
    <ErrorBoundary>
      <main className="bg-gray-950 overflow-x-hidden">
        <Navbar />
        <HeroSection />
    
        <FeaturesGrid />
        <ProcessFlow />
        <CTABanner />
        <Footer />
      </main>
    </ErrorBoundary>
  );
}
