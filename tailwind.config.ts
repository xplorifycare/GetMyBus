import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#0A84FF", // Strict iOS blue accent
        "system-bg": "#000000",
        "system-card": "#1C1C1E", // Apple System Gray 6 (Dark)
        "system-gray-1": "#8E8E93", // Apple System Gray
        "system-gray-2": "#AEAEB2",
        "system-gray-3": "#C7C7CC",
        "system-gray-4": "#D1D1D6",
        "system-gray-5": "#E5E5EA",
        "system-gray-6": "#F2F2F7",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

