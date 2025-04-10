import "./globals.css";

export const metadata = {
  title: "Perf.io",
  description: "Piloter votre activité de Freelance comme un chef d'entreprise ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="light">
      <body className="min-h-screen bg-background font-sans antialiased">
        <main className="flex min-h-screen flex-col items-center">{children}</main>
      </body>
    </html>
  );
}
