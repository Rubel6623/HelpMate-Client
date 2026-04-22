import React from "react";
import { PageBackground } from "@/src/components/shared/PageBackground";

export default function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen relative">
      <PageBackground />
      {children}
    </div>
  );
}
