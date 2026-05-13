import { Metadata } from "next";
import RunnersContent from "./RunnersContent";

export const metadata: Metadata = {
  title: "Find Student Runners | HelpMate",
  description: "Browse through our active student runners ready to help you with your errands and tasks. Reliable, verified, and affordable campus services.",
  keywords: ["student runners", "campus delivery", "errand service", "hiring student help", "HelpMate"],
  openGraph: {
    title: "Find Your Perfect Runner | HelpMate",
    description: "Connect with reliable student runners for your campus tasks.",
    type: "website",
  }
};

export default function RunnersPage() {
  return <RunnersContent />;
}
