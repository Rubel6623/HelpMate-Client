import { ThemeProvider } from "next-themes"
import { Navbar } from "./_components/shared/navbar/Navbar"


export default function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Navbar />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
