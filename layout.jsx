import "./globals.css";

export const metadata = {
  title: "Atticor Merch Hub",
  description:
    "One approved catalog for branded merch across the Atticor portfolio — request, approve, source, and track.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
