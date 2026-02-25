import "./globals.css";

export const metadata = {
  title: "Project B Web",
  description: "Next.js app-router scaffold"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
