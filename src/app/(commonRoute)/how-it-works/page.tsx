import { Navbar } from "../_components/shared/navbar/Navbar";
import { Footer } from "../_components/shared/footer/Footer";
import { HowItWorks } from "./HowItWorks";

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <div className="pt-10">
        <HowItWorks />
      </div>
      <Footer />
    </>
  );
}
