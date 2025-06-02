import { Inter, Merriweather } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather",
  display: "swap",
})

export const metadata = {
  title: "FEED - Forum for Energy and Environment Development",
  description:
    "Leading the transformation towards clean energy and environmental sustainability through innovative research, policy development, and strategic partnerships.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
