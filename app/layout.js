import "./globals.css";

export const metadata = {
  title: "Skilluence Job Portal",
  description: "Find visa-sponsored jobs in the USA with a modern Next.js portal.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
