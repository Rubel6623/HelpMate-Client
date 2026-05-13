import { Metadata } from "next";
import TasksContent from "./TasksContent";

export const metadata: Metadata = {
  title: "Available Tasks | HelpMate",
  description: "Browse available tasks in your area, help others, and earn money as a student runner.",
  keywords: ["tasks", "student earning", "delivery service", "HelpMate marketplace"],
};

export default function TasksPage() {
  return <TasksContent />;
}
