"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { updateItem, deleteItem, WardrobeItem } from "@/lib/wardrobe";
import BottomNav from "@/components/BottomNav";

// ─── descriptor groups ────────────────────────────────────────────────────────

const DESCRIPTOR_GROUPS = [
  { label: "FIT", options: ["OVERSIZED", "RELAXED", "SLIM", "TAILORED", "CROPPED"] },
  { label: "FEEL", options: ["FEMININE", "MASCULINE", "SPORTY", "ELEGANT", "MINIMAL"] },
  { label: "OCCASION", options: ["CASUAL", "WORK", "FORMAL", "WEEKEND", "GOING OUT"] },
] as const;

const TYPE_OPTIONS = ["top", "bottom", "outerwear", "shoes", "accessory"] as const;

const PLATE_GRADS = [
  "linear-gradient(155deg,#2c2c2a 0%,#7e7d78 55%,#cbcac4 100%)",
  "linear-gradient(155deg,#1b1b1a,#525250,#9b9a95)",
  "linear-gradient(150deg,#3a3a37,#86857f,#bdbcb6)",
  "linear-gradient(160deg,#222221,#6d6c67,#a9a8a2)",
];

// ─── style constants ──────────────────────────────────────────────────────────

const MONO: React.CSSProperties = {
  fontFamily: "var(--font-mono), 'SFMono-Regular', monospace",
};
const SERIF: React.CSSProperties = {
  fontFamily: "var(--font-display), Georgia, serif",
};
const SANS: React.CSSProperties = {
  fontFamily: "var(--font-sans), 'Helvetica Neue', Arial, sans-serif",
};

const FIELD_LABEL: React.CSSProperties = {
  ...MONO,
  fontSize: 9,
  fontWeight: 500,
  letterSpacing: "0.16em",
  textTransform: "uppercase" as const,
  color: "#8C8C86",
  display: "block",
  marginBottom: 10,
};

const FIELD_INPUT: React.CSSProperties = {
  ...SANS,
  width: "100%",
  background: "transparent",
  border: "none",
  borderBottom: "1px solid rgba(14,14,14,0.18)",
  color: "#0E0E0E",
  fontSize: 16,
  fontWeight: 400,
  padding: "0 0 10px",
  outline: "none",
  borderRadius: 0,
  boxSizing: "border-box" as const,
};

// ─── MoreMenu — bottom sheet ──────────────────────────────────────────────────

function MoreMenu({
  onEdit,
  onDelete,
  onClose,
}: {
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteClick = useCallback(() => {
    if (!confirming) { setConfirming(true); return; }
    setDeleting(true);
    onDelete();
  }, [confirming, onDelete]);

  const ROW: React.CSSProperties = {
    width: "100%",
    height: 58,
    display: "flex",
    alignItems: "center",
    padding: "0 20px",
    background: "none",
    border: "none",
    borderBottom: "1px solid rgba(14,14,14,0.08)",
    cursor: "pointer",
    textAlign: "left" as const,
  };

  return (
    <>
      {/* backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(14,14,14,0.38)",
          zIndex: 40,
          transition: "opacity 0.24s cubic-bezier(0.22,1,0.36,1)",
        }}
      />

      {/* sheet */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 390,
          background: "#FAFAF8",
          borderTop: "1px solid rgba(14,14,14,0.14)",
          zIndex: 50,
          paddingBottom: 28,
        }}
      >
        {/* drag handle — visual cue */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 32, height: 3, background: "rgba(14,14,14,0.18)" }} />
        </div>

        {!confirming ? (
          <>
            {/* Edit details */}
            <button
              onClick={() => { onClose(); onEdit(); }}
              style={ROW}
            >
              <span
                style={{
                  ...MONO,
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#0E0E0E",
                }}
              >
                Edit details
              </span>
            </button>

            {/* Delete item */}
            <button
              onClick={handleDeleteClick}
              style={{ ...ROW, borderBottom: "none" }}
            >
              <span
                style={{
                  ...MONO,
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#B23A33",
                }}
              >
                Delete item
              </span>
            </button>
          </>
        ) : (
          <>
            {/* Confirmation state */}
            <div style={{ padding: "16px 20px 4px" }}>
              <p
                style={{
                  ...SERIF,
                  fontSize: 20,
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "#0E0E0E",
                  margin: "0 0 4px",
                  lineHeight: 1.2,
                }}
              >
                Remove this item?
              </p>
              <p
                style={{
                  ...MONO,
                  fontSize: 9,
                  letterSpacing: "0.12em",
                  color: "#8C8C86",
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                This cannot be undone.
              </p>
            </div>

            <div style={{ height: 1, background: "rgba(14,14,14,0.08)", margin: "12px 0 0" }} />

            {/* Confirm delete */}
            <button
              onClick={handleDeleteClick}
              disabled={deleting}
              style={{ ...ROW }}
            >
              <span
                style={{
                  ...MONO,
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: deleting ? "#ABABA4" : "#B23A33",
                }}
              >
                {deleting ? "Removing…" : "Yes, remove"}
              </span>
            </button>

            {/* Cancel */}
            <button
              onClick={onClose}
              style={{ ...ROW, borderBottom: "none" }}
            >
              <span
                style={{
                  ...MONO,
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#6B6B66",
                }}
              >
                Cancel
              </span>
            </button>
          </>
        )}
      </div>
    </>
  );
}

// ─── ItemDetailPage ───────────────────────────────────────────────────────────

export default function ItemDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  const [item, setItem] = useState<WardrobeItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("");
  const [editColor, setEditColor] = useState("");
  const [editDescriptors, setEditDescriptors] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/wardrobe/${params.id}`)
      .then(async r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setItem(data);
        setEditName(data.name);
        setEditType(data.type);
        setEditColor(data.color ?? "");
        setEditDescriptors(data.descriptors ?? []);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [params.id]);

  const enterEdit = useCallback(() => {
    if (!item) return;
    setEditName(item.name);
    setEditType(item.type);
    setEditColor(item.color ?? "");
    setEditDescriptors(item.descriptors ?? []);
    setError(null);
    setIsEditing(true);
  }, [item]);

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setError(null);
  }, []);

  const handleSave = useCallback(async () => {
    if (!item || !editName.trim() || !editType) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await updateItem(item.id, {
        name: editName.trim(),
        type: editType,
        color: editColor.trim() || null,
        descriptors: editDescriptors,
      });
      setItem(updated);
      setIsEditing(false);
    } catch {
      setError("Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  }, [item, editName, editType, editColor, editDescriptors]);

  const handleDelete = useCallback(async () => {
    if (!item) return;
    try {
      await deleteItem(item.id);
      router.push("/closet");
    } catch {
      setMenuOpen(false);
      setError("Failed to delete. Try again.");
    }
  }, [item, router]);

  const toggleDescriptor = useCallback((desc: string) => {
    setEditDescriptors((prev) =>
      prev.includes(desc) ? prev.filter((d) => d !== desc) : [...prev, desc]
    );
  }, []);

  // ── loading / not found ────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#F3F2EF", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ ...MONO, fontSize: 11, letterSpacing: "0.14em", color: "#8C8C86" }}>LOADING</span>
      </div>
    );
  }

  if (notFound || !item) {
    return (
      <div style={{ minHeight: "100vh", background: "#F3F2EF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
        <p style={{ ...SERIF, fontSize: 22, fontStyle: "italic", color: "#3A3A38", margin: 0 }}>Item not found.</p>
        <button
          onClick={() => router.push("/closet")}
          style={{ ...SANS, background: "#0E0E0E", color: "#FFFFFF", border: "none", padding: "14px 32px", fontSize: 12, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", cursor: "pointer" }}
        >
          BACK TO CLOSET
        </button>
      </div>
    );
  }

  const descriptors = item.descriptors ?? [];

  // ── shared image plate ─────────────────────────────────────────────────────

  const imagePlate = (
    <div
      style={{
        width: "100%",
        aspectRatio: "3/4",
        position: "relative",
        overflow: "hidden",
        background: item.image_url ? "#1A1A1A" : PLATE_GRADS[0],
        flexShrink: 0,
      }}
    >
      {item.image_url ? (
        <img
          src={item.image_url}
          alt={item.name}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <div style={{ position: "absolute", top: 0, bottom: 0, left: "52%", width: 1, background: "rgba(255,255,255,0.14)" }} />
      )}
    </div>
  );

  // ── shared shell ───────────────────────────────────────────────────────────

  const shell = (header: React.ReactNode, body: React.ReactNode) => (
    <div style={{ minHeight: "100vh", background: "#F3F2EF", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 390, minHeight: "100vh", display: "flex", flexDirection: "column", background: "#F3F2EF" }}>
        <header style={{ height: 52, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, borderBottom: "1px solid rgba(14,14,14,0.12)", background: "#F3F2EF" }}>
          {header}
        </header>
        <main style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
          {body}
        </main>
        <BottomNav />
        {menuOpen && (
          <MoreMenu
            onEdit={enterEdit}
            onDelete={handleDelete}
            onClose={() => setMenuOpen(false)}
          />
        )}
      </div>
    </div>
  );

  // ── view mode ──────────────────────────────────────────────────────────────

  if (!isEditing) {
    return shell(
      /* header */
      <>
        <button
          onClick={() => router.push("/closet")}
          style={{ ...MONO, background: "none", border: "none", fontSize: 10, letterSpacing: "0.16em", color: "#6B6B66", cursor: "pointer", padding: 0, textTransform: "uppercase" }}
        >
          ← BACK
        </button>
        {/* ⋯ more button */}
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="More options"
          style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 2px", display: "flex", alignItems: "center", lineHeight: 1 }}
        >
          <svg width="20" height="4" viewBox="0 0 20 4" fill="#0E0E0E" aria-hidden="true">
            <circle cx="2" cy="2" r="1.5" />
            <circle cx="10" cy="2" r="1.5" />
            <circle cx="18" cy="2" r="1.5" />
          </svg>
        </button>
      </>,
      /* body */
      <>
        {imagePlate}
        <div style={{ padding: "24px 20px 0" }}>

          <span style={{ ...MONO, fontSize: 9, fontWeight: 500, letterSpacing: "0.16em", color: "#8C8C86", textTransform: "uppercase", display: "block" }}>
            {item.type}
          </span>
          <h1 style={{ ...SERIF, fontSize: 34, fontWeight: 500, lineHeight: 1.06, letterSpacing: "-0.01em", color: "#0E0E0E", margin: "6px 0 0" }}>
            {item.name}
          </h1>
          {item.color && (
            <span style={{ ...MONO, fontSize: 11, letterSpacing: "0.1em", color: "#6B6B66", textTransform: "uppercase", display: "block", marginTop: 10 }}>
              {item.color}
            </span>
          )}

          <div style={{ height: 1, background: "rgba(14,14,14,0.08)", margin: "20px 0" }} />

          <span style={{ ...MONO, fontSize: 9, fontWeight: 500, letterSpacing: "0.16em", color: "#8C8C86", textTransform: "uppercase", display: "block", marginBottom: 12 }}>
            STYLE
          </span>

          {descriptors.length === 0 ? (
            <p style={{ ...SERIF, fontSize: 17, fontStyle: "italic", color: "#ABABA4", margin: 0 }}>
              No style tags yet.{" "}
              <button
                onClick={enterEdit}
                style={{ ...SERIF, fontSize: 17, fontStyle: "italic", color: "#6B6B66", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}
              >
                Tap Edit to add.
              </button>
            </p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {descriptors.map((d) => (
                <span
                  key={d}
                  className="rounded-full"
                  style={{ ...MONO, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", padding: "7px 14px", background: "#0E0E0E", color: "#F3F2EF", display: "inline-block" }}
                >
                  {d}
                </span>
              ))}
            </div>
          )}

          {error && (
            <p style={{ ...MONO, fontSize: 10, color: "#B23A33", letterSpacing: "0.1em", marginTop: 16, textTransform: "uppercase" }}>
              {error}
            </p>
          )}

          <div style={{ height: 32 }} />
        </div>
      </>
    );
  }

  // ── edit mode ──────────────────────────────────────────────────────────────

  const canSave = editName.trim().length > 0 && editType.length > 0 && !saving;

  return shell(
    /* header */
    <>
      <button
        onClick={cancelEdit}
        style={{ ...MONO, background: "none", border: "none", fontSize: 10, letterSpacing: "0.16em", color: "#6B6B66", cursor: "pointer", padding: 0, textTransform: "uppercase" }}
      >
        CANCEL
      </button>
      <button
        onClick={handleSave}
        disabled={!canSave}
        style={{ ...MONO, background: "none", border: "none", fontSize: 10, letterSpacing: "0.16em", color: canSave ? "#0E0E0E" : "#ABABA4", cursor: canSave ? "pointer" : "default", padding: 0, textTransform: "uppercase", fontWeight: 500 }}
      >
        {saving ? "SAVING…" : "SAVE"}
      </button>
    </>,
    /* body */
    <>
      <div style={{ opacity: 0.7 }}>{imagePlate}</div>
      <div style={{ padding: "28px 20px 0" }}>

        <div style={{ marginBottom: 28 }}>
          <label style={FIELD_LABEL}>ITEM NAME</label>
          <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} style={FIELD_INPUT} autoFocus />
        </div>

        <div style={{ marginBottom: 28 }}>
          <label style={FIELD_LABEL}>TYPE</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {TYPE_OPTIONS.map((t) => {
              const active = editType === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setEditType(t)}
                  style={{ ...MONO, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", padding: "8px 14px", background: active ? "#0E0E0E" : "transparent", color: active ? "#F3F2EF" : "#6B6B66", border: `1px solid ${active ? "#0E0E0E" : "rgba(14,14,14,0.22)"}`, cursor: "pointer", transition: "background 0.16s, color 0.16s, border-color 0.16s" }}
                >
                  {t.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <label style={FIELD_LABEL}>COLOUR</label>
          <input type="text" placeholder="e.g. Ivory, Charcoal, Navy" value={editColor} onChange={(e) => setEditColor(e.target.value)} style={FIELD_INPUT} />
        </div>

        {DESCRIPTOR_GROUPS.map(({ label, options }) => (
          <div key={label} style={{ marginBottom: 24 }}>
            <label style={FIELD_LABEL}>{label}</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {options.map((opt) => {
                const active = editDescriptors.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleDescriptor(opt)}
                    className="rounded-full"
                    style={{ ...MONO, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", padding: "7px 14px", background: active ? "#0E0E0E" : "transparent", color: active ? "#F3F2EF" : "#6B6B66", border: `1px solid ${active ? "#0E0E0E" : "rgba(14,14,14,0.2)"}`, cursor: "pointer", transition: "background 0.16s cubic-bezier(0.22,1,0.36,1), color 0.16s cubic-bezier(0.22,1,0.36,1)" }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div style={{ height: 1, background: "rgba(14,14,14,0.08)", margin: "16px 0 24px" }} />

        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          style={{ ...SANS, width: "100%", height: 52, background: canSave ? "#0E0E0E" : "rgba(14,14,14,0.1)", color: canSave ? "#FFFFFF" : "#ABABA4", border: "none", fontSize: 12, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", cursor: canSave ? "pointer" : "default", transition: "background 0.18s, color 0.18s" }}
        >
          {saving ? "SAVING…" : "SAVE CHANGES"}
        </button>

        {error && (
          <p style={{ ...MONO, fontSize: 10, color: "#B23A33", letterSpacing: "0.1em", marginTop: 12, textTransform: "uppercase" }}>
            {error}
          </p>
        )}

        <div style={{ height: 16 }} />
      </div>
    </>
  );
}
