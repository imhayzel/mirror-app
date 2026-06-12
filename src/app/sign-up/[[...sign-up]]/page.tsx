import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F3F2EF",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
      }}
    >
      <div style={{ marginBottom: 40, textAlign: "center" }}>
        <span className="font-display italic text-[36px] font-medium tracking-[-0.01em] text-[#0E0E0E] block">
          Mirror
        </span>
        <span className="font-mono-label text-[10px] tracking-[0.16em] uppercase text-[rgba(14,14,14,0.35)] block mt-2">
          GET DRESSED, DECIDED.
        </span>
      </div>

      <SignUp />
    </div>
  );
}
