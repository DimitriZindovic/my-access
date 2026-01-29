import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import { Header } from "../components/blocks/Header";
import { Footer } from "../components/blocks/Footer";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyAccess - Centres de santé accessibles",
  description: "Trouvez des centres de vaccination et dépistage accessibles près de chez vous",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
