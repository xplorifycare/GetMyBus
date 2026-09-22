import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bus Fleet Modernization Plans | GetMyBus Kerala",
  description:
    "Equip your Kerala private bus with 32\" smart TV screens, cashless ETM ticketing, and live GPS tracking. Zero upfront capex options auto-deducted from guaranteed ₹2,500/month advertising rent.",
  keywords: [
    "bus owner plans Kerala",
    "private bus monetization",
    "bus TV advertising",
    "bus GPS tracker Kerala",
    "ETM ticketing machine Kerala",
    "Sunmi POS bus ticketing",
    "bus owner passive income",
  ],
  openGraph: {
    title: "Bus Fleet Modernization Plans | GetMyBus Kerala",
    description:
      "Equip your Kerala private bus with 32\" smart TV screens, cashless ETM ticketing, and live GPS tracking. Earn guaranteed ₹2,500/month ad rent.",
    url: "https://www.getmybus.in/plans",
    siteName: "GetMyBus",
    locale: "en_IN",
    type: "website",
  },
};

export default function PlansLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
