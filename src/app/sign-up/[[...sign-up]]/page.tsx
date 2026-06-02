import { SignUp } from "@clerk/nextjs";

const MONO: React.CSSProperties = {
  fontFamily: "var(--font-mono), 'SFMono-Regular', monospace",
};
const SERIF: React.CSSProperties = {
  fontFamily: "var(--font-display), Georgia, serif",
};

export default function SignUpPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0E0E0E",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
      }}
    >
      {/* Wordmark */}
      <div style={{ marginBottom: 40, textAlign: "center" }}>
        <span
          style={{
            ...SERIF,
            fontSize: 36,
            fontWeight: 500,
            fontStyle: "italic",
            color: "#FFFFFF",
            letterSpacing: "-0.01em",
            display: "block",
          }}
        >
          Mirror
        </span>
        <span
          style={{
            ...MONO,
            fontSize: 10,
            letterSpacing: "0.16em",
            color: "rgba(255,255,255,0.35)",
            textTransform: "uppercase",
            display: "block",
            marginTop: 8,
          }}
        >
          GET DRESSED, DECIDED.
        </span>
      </div>

      <SignUp
        appearance={{
          variables: {
            colorBackground: "#1A1A1A",
            colorText: "#FFFFFF",
            colorTextSecondary: "rgba(255,255,255,0.5)",
            colorInputBackground: "#0E0E0E",
            colorInputText: "#FFFFFF",
            colorPrimary: "#FFFFFF",
            borderRadius: "0px",
            fontFamily: "var(--font-sans), 'Helvetica Neue', Arial, sans-serif",
          },
          elements: {
            card: {
              background: "#1A1A1A",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "0px",
              boxShadow: "none",
              padding: "32px",
              width: "100%",
              maxWidth: "390px",
            },
            headerTitle: {
              fontFamily: "var(--font-display), Georgia, serif",
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: "26px",
              letterSpacing: "-0.01em",
              color: "#FFFFFF",
            },
            headerSubtitle: {
              fontFamily: "var(--font-mono), monospace",
              fontSize: "10px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
            },
            formButtonPrimary: {
              background: "#FFFFFF",
              color: "#0E0E0E",
              fontFamily: "var(--font-sans), 'Helvetica Neue', Arial, sans-serif",
              fontWeight: 600,
              fontSize: "13px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              borderRadius: "0px",
              height: "52px",
              border: "none",
            },
            formFieldInput: {
              background: "#0E0E0E",
              border: "none",
              borderBottom: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "0px",
              color: "#FFFFFF",
              fontFamily: "var(--font-sans), 'Helvetica Neue', Arial, sans-serif",
              fontSize: "15px",
              padding: "12px 0",
            },
            formFieldLabel: {
              fontFamily: "var(--font-mono), monospace",
              fontSize: "9px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)",
            },
            footerActionLink: {
              fontFamily: "var(--font-mono), monospace",
              fontSize: "10px",
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.5)",
            },
            dividerLine: {
              background: "rgba(255,255,255,0.1)",
            },
            dividerText: {
              fontFamily: "var(--font-mono), monospace",
              fontSize: "9px",
              letterSpacing: "0.14em",
              color: "rgba(255,255,255,0.3)",
            },
            socialButtonsBlockButton: {
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: "0px",
              color: "rgba(255,255,255,0.7)",
              fontFamily: "var(--font-mono), monospace",
              fontSize: "10px",
              letterSpacing: "0.1em",
            },
            identityPreview: {
              background: "#0E0E0E",
              border: "1px solid rgba(255,255,255,0.1)",
            },
            alertText: {
              fontFamily: "var(--font-mono), monospace",
              fontSize: "10px",
              letterSpacing: "0.08em",
            },
          },
        }}
      />
    </div>
  );
}
