import { Navbar } from "../_components/shared/navbar/Navbar";
import { Footer } from "../_components/shared/footer/Footer";


export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-20 max-w-4xl">
        <h1 className="text-4xl font-black mb-8">Terms of Service</h1>
        <div className="prose prose-lg dark:prose-invert">
          <h2>1. Terms</h2>
          <p>By accessing the website at HelpMate, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
          <h2>2. Use License</h2>
          <p>Permission is granted to temporarily download one copy of the materials on HelpMate's website for personal, non-commercial transitory viewing only.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
