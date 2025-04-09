export const metadata = {
  title: "Perf.io",
  description: "Piloter votre activité de Freelance comme un chef d'entreprise ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
