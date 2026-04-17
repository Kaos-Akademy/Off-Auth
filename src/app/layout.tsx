import type { Metadata } from "next";
import "./globals.css";
import { FlowWebProvider } from "../components/FlowWebProvider";

export const metadata: Metadata = {
  title: "VaultGuard | Your Real Card. Protected by Code.",
  description:
    "Passkey-secured vault with merchant-locked virtual cards for subscriptions and one-time spend.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,500,0..1,0"
          rel="stylesheet"
        />
      </head>
      <body>
        <FlowWebProvider>{children}</FlowWebProvider>
      </body>
    </html>
  );
}
