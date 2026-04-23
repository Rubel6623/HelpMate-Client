"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/src/services/auth";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const checkRole = async () => {
      const user = await getUser();
      if (user && user.role) {
        router.push(`/dashboard/${user.role.toLowerCase()}`);
      } else {
        router.push("/login");
      }
    };
    checkRole();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground font-bold text-lg animate-pulse">Initializing Dashboard...</p>
      </div>
    </div>
  );
}