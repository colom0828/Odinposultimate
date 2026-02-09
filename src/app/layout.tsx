import '../styles/index.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <title>ODIN POS</title>
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
