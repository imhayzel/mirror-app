/* screen-add.jsx — dark immersive "add to closet" capture flow */

function AddScreen({ onClose, onDone }) {
  const [shots, setShots] = React.useState([]);
  const capture = () => {
    if (shots.length >= 6) return;
    setShots(s => [...s, (s.length) % 6]);
  };
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0E0E0E', position: 'relative' }}>
      {/* full-bleed dark viewfinder backdrop */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 80% at 60% 8%, #5a5a58 0%, #1c1c1b 52%, #0a0a0a 100%)', filter: 'grayscale(1) contrast(1.05)' }} />
        <div className="grain-light" />
      </div>

      {/* top: skip */}
      <div style={{ position: 'relative', paddingTop: 56, padding: '56px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div onClick={onClose} style={{ cursor: 'pointer' }}><Mono size={11} track={0.16} color="rgba(255,255,255,0.6)">CLOSE</Mono></div>
        <div onClick={onClose} style={{ cursor: 'pointer' }}><Mono size={11} track={0.16} color="rgba(255,255,255,0.85)">SKIP</Mono></div>
      </div>

      {/* headline */}
      <div style={{ position: 'relative', padding: '34px 20px 0' }}>
        <Kicker color="rgba(255,255,255,0.55)">ADD TO CLOSET</Kicker>
        <Serif size={40} color="var(--paper)" style={{ marginTop: 12, letterSpacing: '-0.02em' }}>
          A few photos.<br />We'll handle<br />the rest.
        </Serif>
      </div>

      {/* viewfinder frame */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ position: 'relative', width: 200, height: 250 }}>
          {[['top','left'],['top','right'],['bottom','left'],['bottom','right']].map(([v,h],i)=>(
            <div key={i} style={{ position: 'absolute', [v]: 0, [h]: 0, width: 26, height: 26,
              borderTop: v==='top'?'1.5px solid rgba(255,255,255,0.8)':'none',
              borderBottom: v==='bottom'?'1.5px solid rgba(255,255,255,0.8)':'none',
              borderLeft: h==='left'?'1.5px solid rgba(255,255,255,0.8)':'none',
              borderRight: h==='right'?'1.5px solid rgba(255,255,255,0.8)':'none' }} />
          ))}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Mono size={9.5} track={0.14} color="rgba(255,255,255,0.5)">CENTER THE GARMENT</Mono>
          </div>
        </div>
      </div>

      {/* captured thumbs */}
      {shots.length > 0 && (
        <div style={{ position: 'relative', display: 'flex', gap: 8, padding: '0 20px 14px' }}>
          {shots.map((idx, i) => (
            <Plate key={i} idx={idx} fold style={{ width: 44, height: 56, border: '1px solid rgba(255,255,255,0.3)' }} />
          ))}
        </div>
      )}

      {/* shutter + action */}
      <div style={{ position: 'relative', padding: '0 20px 14px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Mono size={10} track={0.1} color="rgba(255,255,255,0.55)" style={{ width: 70 }}>{shots.length} ADDED</Mono>
        <button onClick={capture} aria-label="capture" style={{ width: 64, height: 64, borderRadius: 999, border: '2px solid rgba(255,255,255,0.9)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ width: 50, height: 50, borderRadius: 999, background: 'var(--paper)' }} />
        </button>
        <div style={{ width: 70, display: 'flex', justifyContent: 'flex-end' }}>
          <Icon name="image" size={22} color="rgba(255,255,255,0.8)" />
        </div>
      </div>

      <div style={{ position: 'relative', padding: '0 20px 30px' }}>
        <Button variant={shots.length ? 'solid-light' : 'ghost-dark'} onClick={shots.length ? onDone : capture}>
          {shots.length ? `Add ${shots.length} ${shots.length === 1 ? 'item' : 'items'}` : 'Take a photo'}
        </Button>
      </div>
    </div>
  );
}

Object.assign(window, { AddScreen });
