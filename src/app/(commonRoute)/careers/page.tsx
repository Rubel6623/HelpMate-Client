import { Navbar } from "../_components/shared/navbar/Navbar";
import { Footer } from "../_components/shared/footer/Footer";


export default function CareersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-20">
        <h1 className="text-4xl font-black mb-8">Careers at HelpMate</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Join our mission to empower students and simplify lives.
        </p>
        <div className="bg-muted p-12 rounded-[2rem] text-center">
          <h2 className="text-2xl font-bold mb-4">No open positions right now</h2>
          <p className="text-muted-foreground">
            Check back later or follow us on social media for updates.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
