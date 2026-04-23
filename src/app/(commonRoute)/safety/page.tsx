import { Navbar } from "../_components/shared/navbar/Navbar";
import { Footer } from "../_components/shared/footer/Footer";
import FaqSection from "../_components/page/home/FaqSection";

export default function SafetyPage() {
  return (
    <>
      <Navbar />
      <div className="pt-10 min-h-[70vh]">
        <FaqSection />
      </div>
      <Footer />
    </>
  );
}
