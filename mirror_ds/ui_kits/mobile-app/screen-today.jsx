/* screen-today.jsx — the daily outfit hero */

const TODAY_LOOKS = [
  { statement: ['The camel', 'coat, finally.'], cap: 'STYLED FOR 18° · OFFICE', pieces: [
      { cat: 'OUTERWEAR', name: 'Camel wool coat', worn: 22, idx: 0 },
      { cat: 'KNITWEAR', name: 'Ivory ribbed crew', worn: 9, idx: 4 },
      { cat: 'TROUSERS', name: 'Pleated wide-leg', worn: 14, idx: 2 },
    ] },
  { statement: ['Sharp, with', 'a soft edge.'], cap: 'STYLED FOR 18° · DINNER', pieces: [
      { cat: 'TAILORING', name: 'Charcoal blazer', worn: 17, idx: 1 },
      { cat: 'KNITWEAR', name: 'Fine merino tee', worn: 6, idx: 5 },
      { cat: 'DENIM', name: 'Straight indigo', worn: 28, idx: 3 },
    ] },
  { statement: ['Quiet, and', 'all yours.'], cap: 'STYLED FOR 18° · WEEKEND', pieces: [
      { cat: 'KNITWEAR', name: 'Oat oversized knit', worn: 11, idx: 4 },
      { cat: 'TROUSERS', name: 'Cream wide trouser', worn: 8, idx: 2 },
      { cat: 'OUTERWEAR', name: 'Grey trench', worn: 5, idx: 0 },
    ] },
];

function TodayScreen({ onOpenOutfit, look, onShuffle, active, onTab }) {
  const L = TODAY_LOOKS[look % TODAY_LOOKS.length];
  return (
    <Screen
      top={<TopBar right={<Mono size={11} track={0.08} color="var(--slate-500)">18°</Mono>} />}
      bottom={<TabBar active={active} onChange={onTab} />}
    >
      <div style={{ paddingTop: 22, paddingBottom: 28 }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 16, color: 'var(--slate-700)' }}>
          Good morning, Elise.
        </div>
        <Mono size={11} track={0.1} color="var(--slate-400)" style={{ display: 'block', marginTop: 6 }}>
          WED · MAY 29 · 18° · MOSTLY CLEAR
        </Mono>

        <Kicker marker style={{ marginTop: 30, marginBottom: 12 }}>TODAY'S LOOK</Kicker>
        <Serif size={42} style={{ letterSpacing: '-0.02em' }}>
          {L.statement[0]}<br />{L.statement[1]}
        </Serif>

        {/* hero plate */}
        <div onClick={onOpenOutfit} style={{ marginTop: 22, cursor: 'pointer' }}>
          <Plate idx={look} style={{ width: '100%', aspectRatio: 0.82 }}>
            <div style={{ position: 'absolute', left: 14, bottom: 13 }}>
              <Mono size={9.5} track={0.12} color="rgba(255,255,255,0.92)">{L.cap}</Mono>
            </div>
          </Plate>
        </div>

        {/* breakdown */}
        <Kicker style={{ marginTop: 28, marginBottom: 4 }}>THE PIECES</Kicker>
        <div>
          {L.pieces.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 0', borderBottom: '1px solid var(--line-faint)' }}>
              <Plate idx={p.idx} fold style={{ width: 46, height: 58, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <Mono size={9} track={0.12} color="var(--slate-400)">{p.cat}</Mono>
                <Serif size={19} style={{ marginTop: 2 }}>{p.name}</Serif>
              </div>
              <Mono size={9.5} track={0.08} color="var(--slate-300)">{p.worn}×</Mono>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Button variant="dark" onClick={onOpenOutfit}>See the full look</Button>
          <Button variant="outline" onClick={onShuffle}>
            <Icon name="shuffle" size={15} /> Shuffle
          </Button>
        </div>
      </div>
    </Screen>
  );
}

Object.assign(window, { TodayScreen, TODAY_LOOKS });
