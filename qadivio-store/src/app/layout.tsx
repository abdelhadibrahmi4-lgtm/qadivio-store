import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { MetaPixelScript } from '@/components/pixel/MetaPixelScript';
import { PixelEventDebugger } from '@/components/pixel/PixelEventDebugger';
import { OfficialSupportFloating } from '@/components/support/OfficialSupportFloating';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://qadivio-store.onrender.com'),
  title: {
    default: 'Qadivio Store | كاديفيو ستور - متجر الاشتراكات الرقمية وأدوات الذكاء الاصطناعي',
    template: '%s | Qadivio Store',
  },
  description: 'اكتشف أفضل الاشتراكات الرقمية وأدوات الذكاء الاصطناعي بأسعار مناسبة داخل الجزائر: ChatGPT Plus, Gemini Advanced, Claude Pro, Canva Pro, Cursor AI بتفعيل فوري وضمان شامل.',
  keywords: [
    'Qadivio Store',
    'كاديفيو ستور',
    'اشتراكات الذكاء الاصطناعي الجزائر',
    'ChatGPT Plus الجزائر',
    'Gemini Advanced Pro',
    'Claude Pro',
    'Canva Pro تفعيل رسمي',
    'CapCut Pro',
    'Cursor AI Pro',
    'Lovable AI',
    'Duolingo Super',
    'Spotify Premium',
    'بريدي موب BaridiMob',
    'CCP الجزائر',
    'فليكسي Flexy',
    'RedotPay الجزائر'
  ],
  authors: [{ name: 'Qadivio Store' }],
  creator: 'Qadivio Store',
  publisher: 'Qadivio Store',
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
  openGraph: {
    type: 'website',
    locale: 'ar_DZ',
    url: 'https://qadivio-store.onrender.com',
    siteName: 'Qadivio Store',
    title: 'كل عالمك الرقمي في مكان واحد | Qadivio Store',
    description: 'اكتشف أفضل الاشتراكات الرقمية وأدوات الذكاء الاصطناعي بأسعار مناسبة داخل الجزائر مع تفعيل فوري ودفع آمن عبر BaridiMob و CCP.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'Qadivio Store Official Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Qadivio Store | كل عالمك الرقمي في مكان واحد',
    description: 'أفضل الاشتراكات الرقمية وأدوات الذكاء الاصطناعي بأسعار مناسبة داخل الجزائر.',
    images: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80'],
  },
  alternates: {
    canonical: '/',
  },
};

export const viewport: Viewport = {
  themeColor: '#3478F0',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="dark" data-theme="dark">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="antialiased selection:bg-[#3478F0] selection:text-white">
        <CartProvider>
          {/* Meta Pixel Tracker Script */}
          <MetaPixelScript />

          {/* Site Header */}
          <Header />

          {/* Main Content Area */}
          <main className="min-h-screen">
            {children}
          </main>

          {/* Site Footer */}
          <Footer />

          {/* Mobile Bottom Navigation */}
          <MobileNav />

          {/* Global Cart Slide-Over */}
          <CartDrawer />

          {/* Official Social Support Floating Widget */}
          <OfficialSupportFloating />

          {/* Floating Meta Pixel Debugger */}
          <PixelEventDebugger />
        </CartProvider>
      </body>
    </html>
  );
}
