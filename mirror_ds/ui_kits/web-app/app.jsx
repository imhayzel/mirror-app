/* app.jsx (web) — controller */

function WebSaved({ onNav }) {
  const fits = [[0,'Tuesday office','WORN MAY 21'],[1,'Dinner, sharp','WORN MAY 18'],[2,'Slow weekend','SAVED MAY 12'],[3,'Rain plan','SAVED MAY 09'],[4,'All cream','SAVED MAY 04'],[5,'Black on black','SAVED APR 28'],[0,'First warm day','SAVED APR 22'],[2,'Gallery opening','SAVED APR 15']];
  return (
    <div>
      <PageBar title="Saved" right={<WMono size={11} track={0.08} color="var(--slate-500)">14 SAVED · 3 ON REPEAT</WMono>} />
      <div style={{ padding: '26px 44px 52px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', columnGap: 22, rowGap: 34 }}>
        {fits.map(([idx, name, cap], i) => (
          <div key={i} onClick={() => onNav('Today')} style={{ cursor: 'pointer' }}>
            <WPlate idx={idx} style={{ width: '100%', aspectRatio: 0.84 }}>
              <div style={{ position: 'absolute', left: 12, bottom: 10 }}><WMono size={8} track={0.12} color="rgba(255,255,255,0.88)">{cap}</WMono></div>
            </WPlate>
            <WSerif size={18} style={{ marginTop: 9 }}>{name}</WSerif>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddModal({ onClose }) {
  const [shots, setShots] = React.useState([]);
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(14,14,14,0.55)' }} />
      <div style={{ position: 'relative', width: 560, background: 'var(--paper)', boxShadow: 'var(--shadow-3, 0 24px 64px rgba(0,0,0,.3))', padding: '36px 40px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <WKicker>ADD TO CLOSET</WKicker>
            <WSerif size={38} style={{ marginTop: 12 }}>A few photos.<br />We'll handle the rest.</WSerif>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', marginTop: 4 }}><WIcon name="x" size={22} /></button>
        </div>

        <div onClick={() => setShots(s => [...s, s.length % 6])}
          style={{ marginTop: 26, border: '1px dashed var(--line-strong)', minHeight: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, cursor: 'pointer', padding: 20 }}>
          {shots.length === 0 ? (
            <><WIcon name="image" size={26} color="var(--slate-400)" /><WMono size={11} track={0.1} color="var(--slate-400)">DRAG PHOTOS HERE · OR CLICK TO ADD</WMono></>
          ) : (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
              {shots.map((idx, i) => <WPlate key={i} idx={idx} fold style={{ width: 64, height: 82 }} />)}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
          <WMono size={10} track={0.1} color="var(--slate-400)">{shots.length} {shots.length === 1 ? 'ITEM' : 'ITEMS'}</WMono>
          <div style={{ display: 'flex', gap: 10 }}>
            <WButton variant="light" onClick={onClose}>Cancel</WButton>
            <WButton variant="dark" onClick={onClose}>Add {shots.length || ''} {shots.length ? (shots.length === 1 ? 'item' : 'items') : 'items'}</WButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function WebApp() {
  const [active, setActive] = React.useState('Today');
  const [look, setLook] = React.useState(0);
  const [add, setAdd] = React.useState(false);
  const nav = (t) => { if (t === 'Add') { setAdd(true); return; } setActive(t); };

  let screen;
  if (active === 'Today') screen = <WebToday look={look} onShuffle={() => setLook(l => (l + 1) % 3)} onNav={nav} />;
  else if (active === 'Closet') screen = <WebCloset onNav={nav} />;
  else if (active === 'Planner') screen = <WebPlanner onNav={nav} />;
  else screen = <WebSaved onNav={nav} />;

  return (
    <ChromeWindow width={1240} height={780} url="mirror.app" tabs={[{ title: 'Mirror — Today' }]}>
      <div style={{ display: 'flex', height: '100%', background: 'var(--paper)', position: 'relative' }}>
        <Sidebar active={active} onNav={nav} />
        <div className="noscroll" style={{ flex: 1, overflowY: 'auto', background: 'var(--paper)' }}>{screen}</div>
        {add && <AddModal onClose={() => setAdd(false)} />}
      </div>
    </ChromeWindow>
  );
}

Object.assign(window, { WebApp, WebSaved, AddModal });
ReactDOM.createRoot(document.getElementById('root')).render(<WebApp />);
