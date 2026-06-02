/* app.jsx — Mirror mobile kit controller */

function SavedScreen({ active, onTab, onOpenOutfit }) {
  const fits = [
    { idx: 0, name: 'Tuesday office', cap: 'WORN MAY 21' },
    { idx: 1, name: 'Dinner, sharp', cap: 'WORN MAY 18' },
    { idx: 2, name: 'Slow weekend', cap: 'SAVED MAY 12' },
    { idx: 3, name: 'Rain plan', cap: 'SAVED MAY 09' },
    { idx: 4, name: 'All cream', cap: 'SAVED MAY 04' },
    { idx: 5, name: 'Black on black', cap: 'SAVED APR 28' },
  ];
  return (
    <Screen
      top={<TopBar center="Saved" serif right={<Icon name="heart" size={18} />} />}
      bottom={<TabBar active={active} onChange={onTab} />}
      pad={false}
    >
      <div style={{ padding: '20px 20px 16px' }}>
        <Serif size={30}>Your fits.</Serif>
        <Mono size={11} track={0.08} color="var(--slate-400)" style={{ display: 'block', marginTop: 7 }}>14 SAVED · 3 ON REPEAT</Mono>
      </div>
      <div style={{ padding: '0 20px 28px', display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 14, rowGap: 22 }}>
        {fits.map((f, i) => (
          <div key={i} onClick={() => onOpenOutfit(f.idx)} style={{ cursor: 'pointer' }}>
            <Plate idx={f.idx} style={{ width: '100%', aspectRatio: 0.86 }}>
              <div style={{ position: 'absolute', left: 10, bottom: 9 }}>
                <Mono size={8} track={0.12} color="rgba(255,255,255,0.85)">{f.cap}</Mono>
              </div>
            </Plate>
            <Serif size={17} style={{ marginTop: 8 }}>{f.name}</Serif>
          </div>
        ))}
      </div>
    </Screen>
  );
}

function App() {
  const [tab, setTab] = React.useState('Today');
  const [mode, setMode] = React.useState(null);   // null | 'add'
  const [look, setLook] = React.useState(0);
  const [outfit, setOutfit] = React.useState(null); // null | look index

  const handleTab = (t) => {
    if (t === 'Add') { setMode('add'); return; }
    setMode(null); setTab(t);
  };
  const openOutfit = (i) => setOutfit(i === undefined ? look : i);

  // Dark capture flow — its own dark device for correct status-bar color
  if (mode === 'add') {
    return (
      <IOSDevice dark>
        <AddScreen onClose={() => { setMode(null); }} onDone={() => { setMode(null); setTab('Closet'); }} />
      </IOSDevice>
    );
  }

  let screen;
  if (tab === 'Today') screen = <TodayScreen active={tab} onTab={handleTab} look={look} onShuffle={() => setLook(l => (l + 1) % 3)} onOpenOutfit={() => openOutfit(look)} />;
  else if (tab === 'Closet') screen = <ClosetScreen active={tab} onTab={handleTab} onOpenOutfit={() => openOutfit(0)} />;
  else if (tab === 'Saved') screen = <SavedScreen active={tab} onTab={handleTab} onOpenOutfit={openOutfit} />;
  else screen = <YouScreen active={tab} onTab={handleTab} />;

  return (
    <IOSDevice>
      <div style={{ position: 'relative', height: '100%' }}>
        {screen}
        {outfit !== null && <OutfitScreen look={outfit} onClose={() => setOutfit(null)} />}
      </div>
    </IOSDevice>
  );
}

Object.assign(window, { SavedScreen, App });
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
