import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import MotionProvider from "@/components/MotionProvider";
import CustomCursor from "@/components/CustomCursor";
import FilmGrain from "@/components/FilmGrain";
import ScrollProgress from "@/components/ScrollProgress";
import LoadingScreen from "@/components/LoadingScreen";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Eduardo Pineda — Editor & Motion Designer",
  description:
    "Video editing and motion design portfolio of Eduardo Pineda.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${figtree.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-ink">
        <MotionProvider>
          <LoadingScreen />
          <CustomCursor />
          <FilmGrain />
          <ScrollProgress />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
