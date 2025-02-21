import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";

// Adicionar a importação da fonte do Google Fonts
const poppins = "font-family: 'Poppins', sans-serif;";

export const metadata: Metadata = {
  title: "T.I. Chamados",
  description: "Painel de visualização de chamados do departamento de T.I.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{ fontFamily: "Poppins, sans-serif" }}
        className="antialiased"
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
