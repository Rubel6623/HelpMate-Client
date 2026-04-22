import { Navbar } from "./_components/shared/navbar/Navbar";
import BannerPage from "./_components/page/home/Banner";
import { Categories } from "./_components/page/home/Categories";
import { HowItWorks } from "./_components/page/home/HowItWorks";
import { Footer } from "./_components/shared/footer/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <BannerPage />
      <Categories />
      <HowItWorks />
      <Footer />
    </main>
  );
}
