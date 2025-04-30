import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RepliX",
  description: "AI-powered YouTube comment management tool",
  metadataBase: new URL('https://repli-x.vercel.app'),
  openGraph: {
    title: 'RepliX',
    description: 'AI-powered YouTube comment management tool',
    url: 'https://repli-x.vercel.app',
    siteName: 'RepliX',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-gray-900">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href="/LandingPage.jpg" as="image" />
        <link rel="preload" href="/Dashboard.jpg" as="image" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 min-h-screen`}
      >
        <div id="initial-loader" className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center transition-opacity duration-500">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto relative">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-red-500">R</span>
              </div>
            </div>
            <h1 className="text-xl font-bold text-white">RepliX</h1>
            <p className="text-sm text-gray-400">Loading your experience...</p>
          </div>
        </div>
        <AuthProvider>{children}</AuthProvider>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('load', function() {
              document.getElementById('initial-loader').style.opacity = '0';
              setTimeout(function() {
                document.getElementById('initial-loader').style.display = 'none';
              }, 500);
            });
          `
        }} />
      </body>
    </html>
  );
}
