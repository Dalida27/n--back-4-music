import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });
 
export const metadata: Metadata = {
  title: "N! Music app",
  description: "Listen to our music",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Sidebar>
          {children}
        </Sidebar>
      </body>
    </html>
  );
}
