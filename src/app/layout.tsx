import { Geist_Mono, Figtree } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/src/providers/theme-provider"
import { cn } from "@/src/lib/utils";
import AIChatAssistant from "@/src/components/AI_Features/HelpMate_AI_Features";
import { Toaster } from "sonner";

const figtree = Figtree({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", figtree.variable)}
    >
      <body suppressHydrationWarning>
        <ThemeProvider>
          <AIChatAssistant />
          {children}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
