/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customBgBlue: "#4993A3",
        customBgLightBlue: "#DDEAED",
        customBgWhite: "#F5F5F5",
        customWhite: "#EFEFEF",
        customBlack: "#1C1C1C",
        linkColor: "#578FCA",
        activeBg: "#154B57",
        customBgLightBlueOpacity: "rgba(221, 234, 237, 0.3)",
        customBgBlueOpacity: "rgba(73, 147, 163, 0.7)",
        customButtonLightBg: "rgba(209, 219, 222, 0.5)",
        customHeadingColor: "rgba(11, 125, 151, 1)",
        gradientText: "linear-gradient(to right, #64B0C1 100%, #2F535B 84%)",
      },
      backgroundImage: {
        gradientText: "linear-gradient(to right, #64B0C1 100%, #2F535B 84%)",
      },
    },
  },
  plugins: [],
};
