/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#1E3A8A",
          secondary: "#3B82F6",
          accent: "#22C55E",
          bg: "#F8FAFC",
          text: {
            primary: "#0F172A",
            secondary: "#64748B",
          },
        },
      },
      borderRadius: {
        card: "12px",
      },
      boxShadow: {
        card: "0 8px 24px rgba(2, 6, 23, 0.08)",
        soft: "0 10px 30px rgba(2, 6, 23, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
