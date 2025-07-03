/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {


    extend: {
      colors: {
        btncol: "#6347FF",
        quickbtn: "#6347FF",
        maintenance: "#EDF4FC",
        paracolor: "#757575",
        download: "#6347FF",
        color2: "#6347FF24",
        color3: "#41FF1B29",
        color4: "#298EFF26",
        color21: "#6347FF",
        color31: "#269C0E",
        color41: "#298EFF"

      }
    },
  },
  plugins: [require("tailwind-scrollbar")],
}