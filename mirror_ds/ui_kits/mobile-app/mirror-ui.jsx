/* mirror-ui.jsx — shared primitives for the Mirror mobile kit */

// Lucide icon — renders into a span via innerHTML, then converts.
function Icon({ name, size = 20, color = 'currentColor', stroke = 1.6, style = {} }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current || !window.lucide) return;
    ref.current.innerHTML = `<i data-lucide="${name}"></i>`;
    window.lucide.createIcons({
      nameAttr: 'data-lucide',
      attrs: { width: size, height: size, stroke: color, 'stroke-width': stroke },
    });
  }, [name, size, color, stroke]);
  return <span ref={ref} style={{ display: 'inline-flex', width: size, height: size, alignItems: 'center', justifyContent: 'center', ...style }} />;
}

// Monospace utility label
function Mono({ children, size = 12, track = 0.14, color = 'var(--ink)', style = {} }) {
  return <span style={{ fontFamily: 'var(--font-mono)', fontSize: size, letterSpacing: `${track}em`, textTransform: 'uppercase', color, lineHeight: 1.2, ...style }}>{children}</span>;
}

// Kicker (mono, optional marker)
function Kicker({ children, marker = false, color = 'var(--slate-400)', style = {} }) {
  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color, ...style }}>
      {marker && <span style={{ marginRight: 7 }}>▸</span>}{children}
    </div>
  );
}

// Serif heading
function Serif({ children, size = 32, weight = 500, color = 'var(--ink)', italic = false, style = {} }) {
  return <div style={{ fontFamily: 'var(--font-display)', fontWeight: weight, fontStyle: italic ? 'italic' : 'normal', fontSize: size, lineHeight: 1.03, letterSpacing: '-0.01em', color, ...style }}>{children}</div>;
}

// Full-width mono button — variants: dark | light | outline | disabled | ghost-dark
function Button({ children, variant = 'dark', onClick, full = true, style = {} }) {
  const base = {
    fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase',
    padding: '17px 24px', border: '1px solid transparent', cursor: 'pointer', width: full ? '100%' : 'auto',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9,
    transition: 'background var(--ease-out) .18s, transform .12s', userSelect: 'none',
  };
  const variants = {
    dark: { background: 'var(--ink)', color: 'var(--paper)' },
    light: { background: 'var(--white)', color: 'var(--ink)', borderColor: 'var(--line)' },
    outline: { background: 'transparent', color: 'var(--ink)', borderColor: 'var(--ink)' },
    disabled: { background: 'var(--slate-200)', color: 'var(--slate-400)', cursor: 'default' },
    'ghost-dark': { background: 'rgba(255,255,255,0.10)', color: 'var(--white)', borderColor: 'rgba(255,255,255,0.28)' },
    'solid-light': { background: 'var(--white)', color: 'var(--ink)' },
  };
  const [press, setPress] = React.useState(false);
  return (
    <button onClick={variant === 'disabled' ? undefined : onClick}
      onPointerDown={() => setPress(true)} onPointerUp={() => setPress(false)} onPointerLeave={() => setPress(false)}
      style={{ ...base, ...variants[variant], transform: press ? 'scale(0.99)' : 'none', ...style }}>
      {children}
    </button>
  );
}

// Filter pill
function Pill({ children, active = false, muted = false, onClick, style = {} }) {
  const s = active
    ? { background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--ink)' }
    : muted
      ? { background: 'transparent', color: 'var(--slate-400)', borderColor: 'var(--line-strong)' }
      : { background: 'transparent', color: 'var(--ink)', borderColor: 'var(--ink)' };
  return (
    <button onClick={onClick} style={{
      fontFamily: 'var(--font-mono)', fontSize: 12.5, letterSpacing: '0.04em',
      border: '1px solid', borderRadius: 999, padding: '9px 17px', cursor: 'pointer',
      whiteSpace: 'nowrap', transition: 'all var(--ease-out) .18s', ...s, ...style,
    }}>{children}</button>
  );
}

const PLATE_GRADS = [
  'linear-gradient(155deg,#2c2c2a 0%,#7e7d78 55%,#cbcac4 100%)',
  'linear-gradient(155deg,#1b1b1a,#525250,#9b9a95)',
  'linear-gradient(150deg,#3a3a37,#86857f,#bdbcb6)',
  'linear-gradient(160deg,#222221,#6d6c67,#a9a8a2)',
  'linear-gradient(145deg,#45443f,#9a9994,#d2d1cb)',
  'linear-gradient(165deg,#2f2f2c,#73726d)',
];

// Grayscale photographic placeholder plate with grain + optional fabric fold
function Plate({ idx = 0, fold = false, style = {}, children, dark = false }) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: PLATE_GRADS[idx % PLATE_GRADS.length], filter: 'grayscale(1) contrast(1.06)', ...style }}>
      {fold && <div style={{ position: 'absolute', top: 0, bottom: 0, left: '52%', width: 1, background: 'rgba(255,255,255,0.14)' }} />}
      <div className="grain" />
      {children}
    </div>
  );
}

function Divider({ faint = false, style = {} }) {
  return <div style={{ height: 1, background: faint ? 'var(--line-faint)' : 'var(--line)', width: '100%', ...style }} />;
}

// Garment tile — plate + category + serif name
function GarmentTile({ idx = 0, cat = 'OUTERWEAR', name = 'Item', worn, onClick, ratio = 1.25 }) {
  return (
    <div onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <Plate idx={idx} fold style={{ width: '100%', aspectRatio: ratio }} />
      <div style={{ paddingTop: 9 }}>
        <Mono size={9} track={0.14} color="var(--slate-400)">{cat}</Mono>
        <Serif size={18} style={{ marginTop: 3 }}>{name}</Serif>
        {worn !== undefined && <Mono size={9.5} track={0.1} color="var(--slate-300)" style={{ display: 'block', marginTop: 4 }}>WORN {worn}×</Mono>}
      </div>
    </div>
  );
}

// Field row — label + serif value + hairline
function FieldRow({ label, value, placeholder, onClick }) {
  return (
    <div onClick={onClick} style={{ borderBottom: '1px solid var(--line)', padding: '6px 0 13px', marginBottom: 20, cursor: onClick ? 'pointer' : 'default' }}>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--slate-500)', marginBottom: 9 }}>{label}</div>
      <Serif size={28} color={value ? 'var(--ink)' : 'var(--slate-300)'}>{value || placeholder}</Serif>
    </div>
  );
}

// App top bar — centered wordmark, hairline under, clears status bar
function TopBar({ left, right, center = 'Mirror', serif = true, onLeft }) {
  return (
    <div style={{ paddingTop: 56, paddingBottom: 14, borderBottom: '1px solid var(--line)', position: 'relative', flexShrink: 0, background: 'var(--paper)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px', position: 'relative', minHeight: 30 }}>
        {left && <div onClick={onLeft} style={{ position: 'absolute', left: 20, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>{left}</div>}
        {serif
          ? <Serif size={26} style={{ letterSpacing: '0.01em' }}>{center}</Serif>
          : <Mono size={12} track={0.16}>{center}</Mono>}
        {right && <div style={{ position: 'absolute', right: 20, display: 'flex', alignItems: 'center' }}>{right}</div>}
      </div>
    </div>
  );
}

// Bottom tab bar
function TabBar({ active, onChange }) {
  const tabs = ['Today', 'Closet', 'Add', 'Saved', 'You'];
  return (
    <div style={{ flexShrink: 0, borderTop: '1px solid var(--line)', background: 'var(--paper)', display: 'flex', justifyContent: 'space-between', padding: '15px 22px 30px' }}>
      {tabs.map(t => (
        <button key={t} onClick={() => onChange(t)} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: '2px 2px',
          fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
          color: active === t ? 'var(--ink)' : 'var(--slate-300)', transition: 'color var(--ease-out) .18s',
        }}>{t}</button>
      ))}
    </div>
  );
}

// Screen scaffold — fills device, scrollable body, optional top/bottom chrome
function Screen({ children, top, bottom, bg = 'var(--paper)', pad = true }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: bg }}>
      {top}
      <div className="noscroll" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ padding: pad ? '0 20px' : 0 }}>{children}</div>
      </div>
      {bottom}
    </div>
  );
}

Object.assign(window, { Icon, Mono, Kicker, Serif, Button, Pill, Plate, PLATE_GRADS, Divider, GarmentTile, FieldRow, TopBar, TabBar, Screen });
