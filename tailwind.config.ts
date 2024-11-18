import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        sm: "640px", // Small devices (e.g., phones)
        md: "768px", // Medium devices (e.g., tablets)
        lg: "1024px", // Large devices (e.g., desktops)
        xl: "1280px", // Extra large devices (e.g., large desktops)
        "2xl": "1536px", // 2x Extra large devices (e.g., very large desktops)
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        greenCustom500: "#243731",
        greenCustom300: "#2B5F44",
        greenCustom100: "#D8E9E4",
        grey100Custom: "#BBC2C0",
        greenSuccess: "#49A569",
      },
    },
  },
  plugins: [],
} satisfies Config;
