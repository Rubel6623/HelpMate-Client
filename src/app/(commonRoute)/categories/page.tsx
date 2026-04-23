import { Navbar } from "../_components/shared/navbar/Navbar";
import { Footer } from "../_components/shared/footer/Footer";
import { Categories } from "../_components/page/home/Categories";

export default function CategoriesPage() {
  return (
    <>
      <Navbar />
      <div className="pt-10">
        <Categories />
      </div>
      <Footer />
    </>
  );
}
