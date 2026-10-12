import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { MetaPixelScript } from '@/components/pixel/MetaPixelScript';
import { PixelEventDebugger } from '@/components/pixel/PixelEventDebugger';
import { WhatsAppFloatingButton } from '@/components/whatsapp/WhatsAppFloatingButton';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Qadivio Store | كاديفيو ستور - متجر الاشتراكات الرقمية وأدوات الذكاء الاصطناعي',
    template: '%s | Qadivio Store',
  },
  description: 'المتجر الإلكتروني الرائد في الجزائر لشراء وتفعيل اشتراكات وأدوات الذكاء الاصطناعي والبرمجيات: ChatGPT Plus, Gemini Advanced, Claude Pro, Canva Pro, CapCut بأسعار حصرية وتفعيل فوري.',
  keywords: [
    'Qadivio Store',
    'كاديفيو ستور',
    'اشتراكات الذكاء الاصطناعي',
    'ChatGPT Plus الجزائر',
    'Gemini Advanced Pro',
    'Claude Pro',
    'Canva Pro تفعيل',
    'CapCut Pro',
    'بريدي موب BaridiMob',
    'متجر رقمي الجزائر',
    'Cursor AI',
    'متجر AI Planet DZ بديل'
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
    url: 'https://qadivio-store.com',
    siteName: 'Qadivio Store',
    title: 'Qadivio Store | كاديفيو ستور - بوابتك للاشتراكات الرقمية وأدوات الذكاء الاصطناعي',
    description: 'اشتراكات رسمية ومضمونة 100% لأدوات الذكاء الاصطناعي وبرامج التصميم والبرمجة بأسعار تنافسية ودفع عبر بريدي موب مع تفعيل فوري.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'Qadivio Store Official Banner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Qadivio Store | اشتراكات رقمية وذكاء اصطناعي',
    description: 'أقوى أدوات الذكاء الاصطناعي والبرمجيات الرقمية بتفعيل فوري وضمان كامل.',
    images: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80'],
  },
  alternates: {
    canonical: '/',
  },
};

export const viewport: Viewport = {
  themeColor: '#0B0F19',
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
      <body className="antialiased selection:bg-brand-500 selection:text-white">
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

          {/* Floating WhatsApp Support Button */}
          <WhatsAppFloatingButton />

          {/* Floating Meta Pixel Debugger (Allows instant visual testing of Pixel events) */}
          <PixelEventDebugger />
        </CartProvider>
      </body>
    </html>
  );
}
