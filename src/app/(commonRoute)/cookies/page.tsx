import { Navbar } from "../_components/shared/navbar/Navbar";
import { Footer } from "../_components/shared/footer/Footer";


export default function CookiesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-20 max-w-4xl">
        <h1 className="text-4xl font-black mb-8">Cookie Policy</h1>
        <div className="prose prose-lg dark:prose-invert">
          <p>This is the Cookie Policy for HelpMate, accessible from our website.</p>
          <h2>What Are Cookies</h2>
          <p>As is common practice with almost all professional websites this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
