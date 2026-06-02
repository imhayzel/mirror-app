/* screen-outfit.jsx — outfit detail, presented as a full-screen overlay */

function OutfitScreen({ look = 0, onClose }) {
  const L = (window.TODAY_LOOKS || [])[look % (window.TODAY_LOOKS || [1]).length] || {
    statement: ['The look'], cap: 'STYLED', pieces: [],
  };
  const [saved, setSaved] = React.useState(false);
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--paper)', zIndex: 100, display: 'flex', flexDirection: 'column' }}>
      {/* header */}
      <div style={{ paddingTop: 54, paddingBottom: 13, borderBottom: '1px solid var(--line)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '54px 20px 13px' }}>
        <div onClick={onClose} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Icon name="x" size={22} /></div>
        <Mono size={11} track={0.16} color="var(--slate-500)" style={{ whiteSpace: 'nowrap' }}>TODAY'S LOOK</Mono>
        <div onClick={() => setSaved(s => !s)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <Icon name="heart" size={20} color={saved ? 'var(--critical)' : 'var(--ink)'} />
        </div>
      </div>

      <div className="noscroll" style={{ flex: 1, overflowY: 'auto' }}>
        {/* hero */}
        <Plate idx={look} style={{ width: '100%', aspectRatio: 0.92 }}>
          <div style={{ position: 'absolute', left: 16, bottom: 14 }}>
            <Mono size={9.5} track={0.12} color="rgba(255,255,255,0.92)">{L.cap}</Mono>
          </div>
        </Plate>

        <div style={{ padding: '24px 20px 0' }}>
          <Serif size={38} style={{ letterSpacing: '-0.02em' }}>{L.statement.join(' ')}</Serif>

          {/* why this */}
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 15.5, lineHeight: 1.55, color: 'var(--slate-700)', marginTop: 16 }}>
            Cool and dry today, so Mirror leaned into wool and a longer line. You've reached for these three together twice this month — it works.
          </div>

          {/* pieces */}
          <Kicker style={{ marginTop: 30, marginBottom: 4 }}>THE PIECES</Kicker>
          {L.pieces.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 0', borderBottom: '1px solid var(--line-faint)' }}>
              <Plate idx={p.idx} fold style={{ width: 50, height: 64, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <Mono size={9} track={0.12} color="var(--slate-400)">{p.cat}</Mono>
                <Serif size={20} style={{ marginTop: 2 }}>{p.name}</Serif>
              </div>
              <Icon name="chevron-right" size={16} color="var(--slate-300)" />
            </div>
          ))}
        </div>

        <div style={{ padding: '26px 20px 36px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Button variant="dark" onClick={() => setSaved(true)}>{saved ? 'Saved to your fits' : 'Save this fit'}</Button>
          <Button variant="outline" onClick={onClose}>
            <Icon name="shuffle" size={15} /> Try another
          </Button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { OutfitScreen });
