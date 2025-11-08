import type { Metadata, Viewport } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Header, Footer } from "@/components/layout";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Toaster } from "sonner";

// Playfair Display for headlines - elegant, classic serif
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

// Montserrat for body text - clean, modern, friendly
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CCF Animal Welfare - Committee for Campus Fauna",
    template: "%s | CCF Animal Welfare",
  },
  description: "Comprehensive digital platform for campus animal care and volunteer coordination at IIT Roorkee. Join us in caring for campus animals with compassion and dedication.",
  keywords: ["animal welfare", "IIT Roorkee", "campus animals", "volunteer", "animal care", "CCF", "Committee for Campus Fauna"],
  authors: [{ name: "Committee for Campus Fauna" }],
  creator: "CCF Development Team",
  publisher: "Committee for Campus Fauna",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: "CCF Animal Welfare - Committee for Campus Fauna",
    description: "Comprehensive digital platform for campus animal care and volunteer coordination at IIT Roorkee",
    url: "/",
    siteName: "CCF Animal Welfare",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CCF Animal Welfare - Committee for Campus Fauna",
    description: "Caring for campus animals with compassion and dedication",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#9333ea' },
    { media: '(prefers-color-scheme: dark)', color: '#7c3aed' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (theme === 'dark' || (!theme && prefersDark)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${playfairDisplay.variable} ${montserrat.variable} antialiased`}
      >
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-lg focus:shadow-lg"
        >
          Skip to main content
        </a>
        <ErrorBoundary>
          <ThemeProvider>
            <AuthProvider>
              <NotificationProvider>
                <Header />
                <main id="main-content">{children}</main>
                <Footer />
                <Toaster position="top-right" richColors />
              </NotificationProvider>
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
