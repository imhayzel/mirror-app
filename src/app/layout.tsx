import type { Metadata } from "next";
import { Newsreader, Archivo, IBM_Plex_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mirror — Your AI Wardrobe",
  description: "AI-powered wardrobe manager and daily outfit suggestions.",
};

const clerkAppearance = {
  variables: {
    colorBackground: "#F3F2EF",
    colorText: "#0E0E0E",
    colorTextSecondary: "rgba(14,14,14,0.5)",
    colorInputBackground: "#F3F2EF",
    colorInputText: "#0E0E0E",
    colorPrimary: "#0E0E0E",
    borderRadius: "0px",
    fontFamily: "var(--font-sans), 'Helvetica Neue', Arial, sans-serif",
  },
  elements: {
    card: {
      background: "#F3F2EF",
      border: "none",
      borderRadius: "0px",
      boxShadow: "none",
      padding: "32px",
      width: "100%",
      maxWidth: "390px",
    },
    headerTitle: {
      fontFamily: "var(--font-display), Georgia, serif",
      fontStyle: "italic",
      fontWeight: "500",
      fontSize: "26px",
      letterSpacing: "-0.01em",
      color: "#0E0E0E",
    },
    headerSubtitle: {
      fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
      fontSize: "10px",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "rgba(14,14,14,0.45)",
    },
    formButtonPrimary: {
      background: "#0E0E0E",
      color: "#F3F2EF",
      fontFamily: "var(--font-sans), 'Helvetica Neue', Arial, sans-serif",
      fontWeight: "600",
      fontSize: "13px",
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      borderRadius: "0px",
      height: "52px",
      border: "none",
      boxShadow: "none",
    },
    formFieldInput: {
      background: "transparent",
      border: "none",
      borderBottom: "1px solid rgba(14,14,14,0.2)",
      borderRadius: "0px",
      color: "#0E0E0E",
      fontFamily: "var(--font-sans), 'Helvetica Neue', Arial, sans-serif",
      fontSize: "15px",
      padding: "12px 0",
      boxShadow: "none",
    },
    formFieldLabel: {
      fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
      fontSize: "9px",
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "rgba(14,14,14,0.45)",
    },
    footerActionLink: {
      fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
      fontSize: "10px",
      letterSpacing: "0.1em",
      color: "rgba(14,14,14,0.5)",
    },
    dividerLine: {
      background: "rgba(14,14,14,0.12)",
    },
    dividerText: {
      fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
      fontSize: "9px",
      letterSpacing: "0.14em",
      color: "rgba(14,14,14,0.3)",
    },
    socialButtonsBlockButton: {
      background: "transparent",
      border: "1px solid rgba(14,14,14,0.18)",
      borderRadius: "0px",
      color: "rgba(14,14,14,0.7)",
      fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
      fontSize: "10px",
      letterSpacing: "0.1em",
      boxShadow: "none",
    },
    identityPreview: {
      background: "#F3F2EF",
      border: "1px solid rgba(14,14,14,0.12)",
      boxShadow: "none",
    },
    alertText: {
      fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
      fontSize: "10px",
      letterSpacing: "0.08em",
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html lang="en">
        <body
          className={`${newsreader.variable} ${archivo.variable} ${ibmPlexMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
