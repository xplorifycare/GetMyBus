"use client";

// City marquee ticker — infinite horizontal auto-scroll
export default function CityMarquee() {
  const items = [
    { city: "Kochi", buses: "3,240" },
    { city: "Kozhikode", buses: "2,100" },
    { city: "Thrissur", buses: "1,870" },
    { city: "Thiruvananthapuram", buses: "2,550" },
    { city: "Kannur", buses: "980" },
    { city: "Palakkad", buses: "760" },
    { city: "Malappuram", buses: "890" },
    { city: "Alappuzha", buses: "640" },
    { city: "Kollam", buses: "720" },
    { city: "Kottayam", buses: "550" },
    { city: "Pathanamthitta", buses: "310" },
    { city: "Idukki", buses: "240" },
  ];

  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <section id="cities" className="w-full themed-bg py-6 border-y themed-divider overflow-hidden select-none">
      <div className="animate-marquee">
        {doubled.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 px-8 flex-shrink-0"
          >
            {/* Bus icon */}
            <svg
              className="w-4 h-4 text-[#0A84FF] flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M6 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
              <path d="M18 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
              <path d="M4 17h-2v-11a1 1 0 0 1 1 -1h14a5 7 0 0 1 5 7v5h-2m-4 0h-8" />
              <path d="M16 5l1.5 7l4.5 0" />
              <path d="M2 10l15 0" />
              <path d="M7 5l0 5" />
              <path d="M12 5l0 5" />
            </svg>

            <span className="text-[13px] font-medium themed-text whitespace-nowrap">
              {item.city}
            </span>

            {/* Live badge */}
            <span className="flex items-center gap-1.5 bg-[#0A84FF]/10 border border-[#0A84FF]/20 rounded-full px-2.5 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0A84FF] inline-block" style={{ boxShadow: "0 0 6px rgba(10,132,255,0.8)" }} />
              <span className="text-[11px] font-medium text-[#0A84FF] whitespace-nowrap">
                {item.buses} buses
              </span>
            </span>

            {/* Separator dot */}
            <span className="w-1 h-1 rounded-full bg-black/15 dark:bg-white/10 flex-shrink-0 mx-4" />
          </div>
        ))}
      </div>
    </section>
  );
}
