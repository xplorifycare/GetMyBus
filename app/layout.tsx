import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "GetMyBus | Live Bus Tracking & Ad Income for Kerala Private Bus Owners",
  description: "GetMyBus digitises Kerala's private bus fleet — live GPS tracking for commuters, ₹3,500/month passive income for bus owners, and route-targeted advertising for brands.",
  keywords: "GetMyBus, bus tracking Kerala, transit ads Kerala, bus owner income, onboard screen advertising, Kerala private bus, cashless bus tickets, Kollam TVM corridor, ETM machine Kerala bus, private bus operator income scheme",
  authors: [{ name: "GetMyBus Team" }],
  alternates: {
    canonical: "https://www.getmybus.in",
  },
  openGraph: {
    title: "GetMyBus | Live Bus Tracking & Ad Income for Kerala Private Bus Owners",
    description: "GetMyBus digitises Kerala's private bus fleet with live GPS tracking, cashless ETM ticketing, and onboard advertising screens that generate ₹3,500/month passive income for bus owners.",
    url: "https://www.getmybus.in",
    siteName: "GetMyBus",
    images: [
      {
        url: "https://www.getmybus.in/logo_white.png",
        width: 1200,
        height: 630,
        alt: "GetMyBus - Kerala's Public Transit Digitisation Platform",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GetMyBus | Live Bus Tracking & Ad Income for Kerala Private Bus Owners",
    description: "GetMyBus digitises Kerala's private bus fleet with live GPS tracking, cashless ETM ticketing, and onboard advertising screens.",
    images: ["https://www.getmybus.in/logo_white.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured JSON-LD Schemas
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "GetMyBus",
    "url": "https://www.getmybus.in",
    "logo": "https://www.getmybus.in/logo_white.png",
    "description": "GetMyBus digitises Kerala's private bus fleet with live GPS tracking, cashless ETM ticketing, and onboard advertising screens that generate ₹3,500/month income for bus owners.",
    "foundingDate": "2026",
    "areaServed": {
      "@type": "State",
      "name": "Kerala",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Business Inquiries",
      "email": "hello@getmybus.in"
    },
    "sameAs": [
      "https://www.linkedin.com/company/getmybus",
      "https://x.com/getmybusindia",
      "https://www.instagram.com/getmybus.in/"
    ]
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "GetMyBus",
    "image": "https://www.getmybus.in/logo_white.png",
    "url": "https://www.getmybus.in",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Mayyanad",
      "addressRegion": "Kerala",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 8.9231,
      "longitude": 76.6170
    },
    "areaServed": "Kerala"
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How much can a Kerala private bus owner earn from GetMyBus?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A private bus owner on a Kerala highway corridor with 300 daily passengers can earn ₹2,500 to ₹3,500 per month from in-bus advertising revenue through GetMyBus. This is passive income — no operational changes required. The hardware is installed at no upfront cost and paid back from ad earnings over approximately 8 months."
        }
      },
      {
        "@type": "Question",
        "name": "What is GetMyBus and how does it help Kerala bus commuters?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "GetMyBus is a Kerala transit app that tracks private buses live on a map, updated every 4 seconds. Commuters see exactly when their bus will arrive, get smart walk-time alerts, and pay by UPI directly from the conductor's ETM device. GetMyBus is launching on the Kollam–Thiruvananthapuram corridor in Q3 2026."
        }
      },
      {
        "@type": "Question",
        "name": "How does live bus tracking work in the GetMyBus app?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "GetMyBus uses an Android ETM device installed on each bus. The ETM transmits GPS coordinates to the GetMyBus backend every 4 seconds over 4G. Commuters see live bus positions on the app map, receive smart alerts when their bus is approaching, and can view next stop and estimated arrival time in real time."
        }
      },
      {
        "@type": "Question",
        "name": "Is GetMyBus available in Kerala?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "GetMyBus is launching its pilot on the Kollam–Thiruvananthapuram corridor in Q3 2026, starting with 20 private buses. Commuters can join the waitlist at getmybus.in to be notified when their route goes live. Bus operators on the Kollam–TVM corridor can register now to join the founding pilot cohort."
        }
      },
      {
        "@type": "Question",
        "name": "How can private bus owners join GetMyBus?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Private bus owners can register at getmybus.in. GetMyBus installs an ETM, GPS tracker, and in-bus TV screen at no upfront cost. Hardware is recovered from the owner's share of advertising revenue over approximately 8 months. Owners earn 50% of ad revenue generated on their bus, paid monthly on the 5th of each month."
        }
      }
    ]
  };

  return (
    <html lang="en" className="no-scrollbar">
      <head>
        {/* Injecting Structured Data JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-black text-white no-scrollbar`}>
        {children}
      </body>
    </html>
  );
}
