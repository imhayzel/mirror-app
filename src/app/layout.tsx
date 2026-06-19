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

const FONT_SERIF = "'Newsreader', Georgia, serif"
const FONT_SANS  = "'Archivo', 'Helvetica Neue', Arial, sans-serif"
const FONT_MONO  = "'IBM Plex Mono', 'SFMono-Regular', monospace"

const clerkAppearance = {
  variables: {
    colorBackground: "#F3F2EF",
    colorText: "#0E0E0E",
    colorTextSecondary: "rgba(14,14,14,0.45)",
    colorInputBackground: "transparent",
    colorInputText: "#0E0E0E",
    colorPrimary: "#0E0E0E",
    colorDanger: "#B23A33",
    colorSuccess: "#2F7D5B",
    borderRadius: "0px",
    fontFamily: FONT_SANS,
    fontFamilyButtons: FONT_SANS,
    fontSize: "15px",
    spacingUnit: "18px",
  },
  elements: {
    // ── Containers ──────────────────────────────────────────────
    rootBox: {
      width: "100%",
    },
    card: {
      background: "#F3F2EF",
      border: "none",
      borderRadius: "0px",
      boxShadow: "none",
      padding: "32px",
      width: "100%",
      maxWidth: "390px",
    },
    // ── Header ──────────────────────────────────────────────────
    headerTitle: {
      fontFamily: FONT_SERIF,
      fontStyle: "italic",
      fontWeight: "500",
      fontSize: "26px",
      letterSpacing: "-0.01em",
      color: "#0E0E0E",
    },
    headerSubtitle: {
      fontFamily: FONT_MONO,
      fontSize: "9px",
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "rgba(14,14,14,0.4)",
    },
    // ── Form fields ─────────────────────────────────────────────
    formFieldLabel: {
      fontFamily: FONT_MONO,
      fontSize: "9px",
      fontWeight: "500",
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "rgba(14,14,14,0.45)",
    },
    formFieldInput: {
      background: "transparent",
      border: "1px solid #0E0E0E",
      borderRadius: "0px",
      color: "#0E0E0E",
      fontFamily: FONT_SANS,
      fontSize: "15px",
      padding: "12px",
      boxShadow: "none",
      outline: "none",
    },
    formFieldInputShowPasswordButton: {
      color: "rgba(14,14,14,0.4)",
    },
    formFieldErrorText: {
      fontFamily: FONT_MONO,
      fontSize: "9px",
      letterSpacing: "0.08em",
      color: "#B23A33",
    },
    formFieldSuccessText: {
      fontFamily: FONT_MONO,
      fontSize: "9px",
      letterSpacing: "0.08em",
      color: "#2F7D5B",
    },
    formFieldHintText: {
      fontFamily: FONT_MONO,
      fontSize: "9px",
      letterSpacing: "0.08em",
      color: "rgba(14,14,14,0.35)",
    },
    // ── Buttons ─────────────────────────────────────────────────
    formButtonPrimary: {
      background: "#0E0E0E",
      color: "#F3F2EF",
      fontFamily: FONT_SANS,
      fontWeight: "600",
      fontSize: "12px",
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      borderRadius: "0px",
      height: "52px",
      border: "none",
      boxShadow: "none",
    },
    formButtonReset: {
      fontFamily: FONT_MONO,
      fontSize: "10px",
      letterSpacing: "0.1em",
      color: "rgba(14,14,14,0.45)",
      textTransform: "uppercase",
    },
    // ── Social / OAuth ───────────────────────────────────────────
    socialButtonsBlockButton: {
      background: "transparent",
      border: "1px solid rgba(14,14,14,0.2)",
      borderRadius: "0px",
      color: "#0E0E0E",
      fontFamily: FONT_MONO,
      fontSize: "10px",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      boxShadow: "none",
      height: "48px",
    },
    socialButtonsBlockButtonText: {
      fontFamily: FONT_MONO,
      fontSize: "10px",
      letterSpacing: "0.1em",
      color: "#0E0E0E",
    },
    // ── Divider ──────────────────────────────────────────────────
    dividerLine: {
      background: "rgba(14,14,14,0.12)",
    },
    dividerText: {
      fontFamily: FONT_MONO,
      fontSize: "9px",
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "rgba(14,14,14,0.3)",
    },
    // ── Footer ───────────────────────────────────────────────────
    footerActionText: {
      fontFamily: FONT_MONO,
      fontSize: "10px",
      letterSpacing: "0.08em",
      color: "rgba(14,14,14,0.35)",
    },
    footerActionLink: {
      fontFamily: FONT_MONO,
      fontSize: "10px",
      letterSpacing: "0.1em",
      color: "#0E0E0E",
      textDecoration: "underline",
      textUnderlineOffset: "3px",
    },
    // ── Alert / errors ───────────────────────────────────────────
    alertText: {
      fontFamily: FONT_MONO,
      fontSize: "9px",
      letterSpacing: "0.08em",
      color: "#B23A33",
    },
    // ── OTP / verification ───────────────────────────────────────
    otpCodeFieldInput: {
      border: "1px solid #0E0E0E",
      borderRadius: "0px",
      background: "transparent",
      color: "#0E0E0E",
      fontFamily: FONT_SANS,
      fontSize: "20px",
      boxShadow: "none",
    },
    // ── Identity preview (e.g. "signing in as…") ────────────────
    identityPreview: {
      background: "#F3F2EF",
      border: "1px solid rgba(14,14,14,0.12)",
      borderRadius: "0px",
      boxShadow: "none",
    },
    identityPreviewText: {
      fontFamily: FONT_SANS,
      color: "#0E0E0E",
    },
    identityPreviewEditButton: {
      fontFamily: FONT_MONO,
      fontSize: "9px",
      letterSpacing: "0.1em",
      color: "rgba(14,14,14,0.4)",
    },
    // ── Back / misc links ────────────────────────────────────────
    backLink: {
      fontFamily: FONT_MONO,
      fontSize: "10px",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "rgba(14,14,14,0.45)",
    },
    formResendCodeLink: {
      fontFamily: FONT_MONO,
      fontSize: "10px",
      letterSpacing: "0.1em",
      color: "rgba(14,14,14,0.45)",
      textTransform: "uppercase",
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
