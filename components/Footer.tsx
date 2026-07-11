"use client";

import Image from "next/image";

export default function Footer({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const cities = ["Kochi", "Kozhikode", "Thrissur", "Thiruvananthapuram", "Kannur", "Palakkad"];
  const support = ["Help Center", "Contact Us", "Report a Route", "FAQs"];
  const legal = ["Privacy Policy", "Terms of Service", "Cookie Policy"];

  const socials = [
    {
      label: "Twitter / X",
      href: "https://x.com/getmybusindia",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/getmybus.in/",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/getmybus",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="relative w-full themed-bg pt-20 pb-12 px-6 md:px-12 select-none border-t themed-divider overflow-hidden">
      
      {/* Kerala silhouette watermark */}
      <div className="absolute right-8 bottom-8 opacity-[0.015] dark:opacity-[0.025] pointer-events-none select-none">
        <svg width="180" height="280" viewBox="0 0 180 280" fill={theme === "light" ? "black" : "white"} xmlns="http://www.w3.org/2000/svg">
          {/* Simplified Kerala state silhouette shape */}
          <path d="M90 10 C75 15 65 25 60 45 C55 65 52 80 48 100 C44 120 40 140 42 160 C44 175 50 185 55 200 C58 210 60 222 65 235 C68 242 72 250 78 258 C82 263 86 268 90 270 C94 268 98 263 102 258 C108 250 112 242 115 235 C120 222 122 210 125 200 C130 185 136 175 138 160 C140 140 136 120 132 100 C128 80 125 65 120 45 C115 25 105 15 90 10Z" />
          {/* Northern wider section */}
          <path d="M60 45 C52 42 44 38 38 30 C34 22 36 14 42 10 C50 5 62 4 72 8 L90 10 C78 10 68 18 60 45Z" />
          <path d="M120 45 C128 42 136 38 142 30 C146 22 144 14 138 10 C130 5 118 4 108 8 L90 10 C102 10 112 18 120 45Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 mb-16 text-left relative z-10">

        {/* GetMyBus branding column */}
        <div className="flex flex-col space-y-5">
          <Image
            src={theme === "dark" ? "/logo_white.png" : "/logo.png"}
            alt="GetMyBus"
            width={140}
            height={40}
            className="object-contain h-[36px] w-auto"
          />
          <span className="text-[13px] themed-text-muted font-normal leading-relaxed max-w-[220px]">
            Kerala&apos;s unified transit digitisation platform. Smart screens, cashless ticketing, and real-time tracking.
          </span >
          {/* Social icons */}
          <div className="flex items-center gap-3 pt-1">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="w-8 h-8 flex items-center justify-center rounded-[8px] bg-black/[0.03] dark:bg-white/[0.05] border themed-divider themed-text-sub transition-all duration-200 hover:text-[#0A84FF] dark:hover:text-[#0A84FF] hover:bg-[#0A84FF]/10 hover:border-[#0A84FF]/20 hover:drop-shadow-[0_0_8px_rgba(10,132,255,0.4)]"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Cities Column */}
        <div className="flex flex-col space-y-4">
          <span className="text-[11px] font-medium themed-text-sub tracking-[0.1em] uppercase">
            Cities
          </span>
          <ul className="flex flex-col space-y-2.5">
            {cities.map((city, idx) => (
              <li key={idx}>
                <a
                  href="/#commuters"
                  className="text-[13px] themed-text-sub hover:text-[#0A84FF] transition-all duration-200 font-normal"
                >
                  {city}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Support Column */}
        <div className="flex flex-col space-y-4">
          <span className="text-[11px] font-medium themed-text-sub tracking-[0.1em] uppercase">
            Support
          </span>
          <ul className="flex flex-col space-y-2.5">
            {support.map((item, idx) => {
              let href = "/#partner";
              if (item === "FAQs") href = "/#faq";
              return (
                <li key={idx}>
                  <a
                    href={href}
                    className="text-[13px] themed-text-sub hover:text-[#0A84FF] transition-all duration-200 font-normal"
                  >
                    {item}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Legal Column */}
        <div className="flex flex-col space-y-4">
          <span className="text-[11px] font-medium themed-text-sub tracking-[0.1em] uppercase">
            Legal
          </span>
          <ul className="flex flex-col space-y-2.5">
            {legal.map((item, idx) => {
              let href = "/privacy";
              if (item === "Terms of Service") href = "/terms";
              else if (item === "Cookie Policy") href = "/cookies";
              return (
                <li key={idx}>
                  <a
                    href={href}
                    className="text-[13px] themed-text-sub hover:text-[#0A84FF] transition-all duration-200 font-normal"
                  >
                    {item}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t themed-divider flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
        <span className="text-[12px] themed-text-sub font-normal">
          © 2026 GetMyBus. Built for Kerala.
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" style={{ boxShadow: "0 0 5px rgba(52,211,153,0.7)" }} />
          <span className="text-[11px] themed-text-sub font-normal">All systems operational</span>
        </div>
      </div>
    </footer>
  );
}
