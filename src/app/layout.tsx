import type { Metadata } from "next"
import "./globals.css"
import Layout from "@/components/Layout"

export const metadata: Metadata = {
  title: "Calories Tracker",
  description: "Track your daily calorie intake with AI",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="h-full antialiased">
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
