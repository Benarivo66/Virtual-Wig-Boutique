import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopBar from "./ui/TopBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Virtual Wig Boutique",
    template: "%s | Virtual Wig Boutique",
  },
  description: "Discover, buy, and sell unique items at Virtual Wig Boutique.",
  keywords: ["handmade", "marketplace", "crafts", "artisan", "shop"],
  openGraph: {
    title: "Virtual Wig Boutique",
    description: "Discover, buy, and sell unique items at Virtual Wig Boutique",
    url: "https://handcrafted-haven22.vercel.app/",
    siteName: "Virtual Wig Boutique",
    images: [
      {
        url: "/hero-image.webp",
        width: 1200,
        height: 630,
        alt: "Virtual Wig Boutique",
        type: "image/jpeg",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={`${geistSans.variable} ${geistMono.variable}`}>
//           <TopBar />
//           {children}
//       </body>
//     </html>
//   );
// }


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        <TopBar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
