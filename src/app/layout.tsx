import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/app/components/NavigationBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://visualds.vercel.app"),
  title: {
    default: "Visual DS | Interactive Data Structures Visualizer",
    template: "%s | Visual DS",
  },
  description: "Visual DS is an interactive platform to learn, visualize, and practice data structures and algorithms. Explore lessons, run simulations, and test your knowledge.",
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Visual DS | Interactive Data Structures Visualizer",
    description: "Visual DS is an interactive platform to learn, visualize, and practice data structures and algorithms. Explore lessons, run simulations, and test your knowledge.",
    url: "https://visualds.com/",
    siteName: "Visual DS",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "Visual DS Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  keywords: [
    "data structures",
    "algorithms",
    "visualization",
    "interactive learning",
    "DSA",
    "computer science",
    "education",
    "practice",
    "simulator",
    "Visual DS",
    "visualds",
    "visual ds",
    "visual-ds"
  ],
  authors: [{ name: "Your Name", url: "https://visualds.com/" }],
  creator: "Your Name",
  publisher: "Visual DS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={"h-full"}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full flex flex-col`}
      >
        <NavBar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
