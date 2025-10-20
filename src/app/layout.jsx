import localFont from "next/font/local";
import "./globals.css";

const rethinkSans = localFont({
  src: [
    {
      path: "../../public/fonts/Rethink_Sans/RethinkSans-VariableFont_wght.ttf",
      weight: "400",
    },
    {
      path: "../../public/fonts/Rethink_Sans/RethinkSans-VariableFont_wght.ttf",
      weight: "700",
    },
  ],
  variable: "--font-rethink-sans",
});

export const metadata = {
  title: "Carbon Tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${rethinkSans.className} flex bg-tertiary-green text-white`}
      >
        <main className=" w-full">{children}</main>
      </body>
    </html>
  );
}
