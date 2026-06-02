/* web-ui.jsx — shared primitives for the Mirror web app */

function WIcon({ name, size = 20, color = 'currentColor', stroke = 1.6, style = {} }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current || !window.lucide) return;
    ref.current.innerHTML = `<i data-lucide="${name}"></i>`;
    window.lucide.createIcons({ nameAttr: 'data-lucide', attrs: { width: size, height: size, stroke: color, 'stroke-width': stroke } });
  }, [name, size, color, stroke]);
  return <span ref={ref} style={{ display: 'inline-flex', width: size, height: size, alignItems: 'center', justifyContent: 'center', ...style }} />;
}

function WMono({ children, size = 12, track = 0.14, color = 'var(--ink)', style = {} }) {
  return <span style={{ fontFamily: 'var(--font-mono)', fontSize: size, letterSpacing: `${track}em`, textTransform: 'uppercase', color, lineHeight: 1.2, ...style }}>{children}</span>;
}
function WKicker({ children, marker = false, color = 'var(--slate-400)', style = {} }) {
  return <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color, ...style }}>{marker && <span style={{ marginRight: 8 }}>▸</span>}{children}</div>;
}
function WSerif({ children, size = 40, weight = 500, color = 'var(--ink)', italic = false, style = {} }) {
  return <div style={{ fontFamily: 'var(--font-display)', fontWeight: weight, fontStyle: italic ? 'italic' : 'normal', fontSize: size, lineHeight: 1.02, letterSpacing: '-0.015em', color, ...style }}>{children}</div>;
}

function WButton({ children, variant = 'dark', onClick, full = false, style = {} }) {
  const base = { fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', padding: '15px 26px', border: '1px solid transparent', cursor: 'pointer', width: full ? '100%' : 'auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'background .18s, transform .1s', userSelect: 'none' };
  const v = {
    dark: { background: 'var(--ink)', color: 'var(--paper)' },
    light: { background: 'var(--white)', color: 'var(--ink)', borderColor: 'var(--line)' },
    outline: { background: 'transparent', color: 'var(--ink)', borderColor: 'var(--ink)' },
  }[variant];
  const [p, setP] = React.useState(false);
  return <button onClick={onClick} onPointerDown={() => setP(true)} onPointerUp={() => setP(false)} onPointerLeave={() => setP(false)} style={{ ...base, ...v, transform: p ? 'scale(0.99)' : 'none', ...style }}>{children}</button>;
}

function WPill({ children, active = false, muted = false, onClick }) {
  const s = active ? { background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--ink)' }
    : muted ? { background: 'transparent', color: 'var(--slate-400)', borderColor: 'var(--line-strong)' }
    : { background: 'transparent', color: 'var(--ink)', borderColor: 'var(--ink)' };
  return <button onClick={onClick} style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, letterSpacing: '0.04em', border: '1px solid', borderRadius: 999, padding: '9px 18px', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .18s', ...s }}>{children}</button>;
}

const WGRADS = [
  'linear-gradient(155deg,#2c2c2a,#7e7d78 55%,#cbcac4)',
  'linear-gradient(155deg,#1b1b1a,#525250,#9b9a95)',
  'linear-gradient(150deg,#3a3a37,#86857f,#bdbcb6)',
  'linear-gradient(160deg,#222221,#6d6c67,#a9a8a2)',
  'linear-gradient(145deg,#45443f,#9a9994,#d2d1cb)',
  'linear-gradient(165deg,#2f2f2c,#73726d)',
];
function WPlate({ idx = 0, fold = false, style = {}, children }) {
  return <div style={{ position: 'relative', overflow: 'hidden', background: WGRADS[idx % WGRADS.length], filter: 'grayscale(1) contrast(1.06)', ...style }}>
    {fold && <div style={{ position: 'absolute', top: 0, bottom: 0, left: '52%', width: 1, background: 'rgba(255,255,255,0.14)' }} />}
    <div className="grain" />{children}
  </div>;
}

function WGarment({ idx, cat, name, worn, onClick }) {
  const [h, setH] = React.useState(false);
  return <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ cursor: 'pointer' }}>
    <WPlate idx={idx} fold style={{ width: '100%', aspectRatio: 0.82, transition: 'opacity .2s', opacity: h ? 0.9 : 1 }} />
    <div style={{ paddingTop: 11 }}>
      <WMono size={9.5} track={0.14} color="var(--slate-400)">{cat}</WMono>
      <WSerif size={21} style={{ marginTop: 4 }}>{name}</WSerif>
      {worn !== undefined && <WMono size={9.5} track={0.1} color="var(--slate-300)" style={{ display: 'block', marginTop: 5 }}>WORN {worn}×</WMono>}
    </div>
  </div>;
}

// Left navigation rail
function Sidebar({ active, onNav }) {
  const nav = [['Today', 'sparkles'], ['Closet', 'shirt'], ['Planner', 'calendar'], ['Saved', 'heart']];
  return (
    <div style={{ width: 232, flexShrink: 0, borderRight: '1px solid var(--line)', background: 'var(--paper)', display: 'flex', flexDirection: 'column', padding: '30px 0' }}>
      <div style={{ padding: '0 28px 26px' }}>
        <WSerif size={28} style={{ letterSpacing: '0.01em' }}>Mirror</WSerif>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 16px' }}>
        {nav.map(([label, icon]) => {
          const on = active === label;
          return (
            <button key={label} onClick={() => onNav(label)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px', background: on ? 'var(--fill-press)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background .15s' }}>
              <WIcon name={icon} size={18} color={on ? 'var(--ink)' : 'var(--slate-500)'} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: on ? 'var(--ink)' : 'var(--slate-500)' }}>{label}</span>
            </button>
          );
        })}
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ padding: '0 16px' }}>
        <WButton variant="dark" full onClick={() => onNav('Add')} style={{ padding: '13px 18px' }}><WIcon name="plus" size={15} /> Add items</WButton>
      </div>
      <div style={{ padding: '22px 28px 0', display: 'flex', alignItems: 'center', gap: 11 }}>
        <WPlate idx={5} style={{ width: 32, height: 32, borderRadius: 999 }} />
        <div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink)' }}>Elise Tan</div>
          <WMono size={8.5} track={0.12} color="var(--slate-400)">MINIMAL · NEUTRAL</WMono>
        </div>
      </div>
    </div>
  );
}

// Page top bar inside main canvas
function PageBar({ title, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '34px 44px 22px', borderBottom: '1px solid var(--line)' }}>
      <WSerif size={34}>{title}</WSerif>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>{right}</div>
    </div>
  );
}

Object.assign(window, { WIcon, WMono, WKicker, WSerif, WButton, WPill, WPlate, WGRADS, WGarment, Sidebar, PageBar });
