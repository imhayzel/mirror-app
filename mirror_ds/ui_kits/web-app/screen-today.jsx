/* screen-today.jsx (web) — dashboard / daily look */

const WEB_LOOKS = [
  { statement: ['The camel coat,', 'finally.'], cap: 'STYLED FOR 18° · OFFICE', pieces: [['OUTERWEAR','Camel wool coat'],['KNITWEAR','Ivory ribbed crew'],['TROUSERS','Pleated wide-leg']] },
  { statement: ['Sharp, with', 'a soft edge.'], cap: 'STYLED FOR 18° · DINNER', pieces: [['TAILORING','Charcoal blazer'],['KNITWEAR','Fine merino tee'],['DENIM','Straight indigo']] },
  { statement: ['Quiet, and', 'all yours.'], cap: 'STYLED FOR 18° · WEEKEND', pieces: [['KNITWEAR','Oat oversized knit'],['TROUSERS','Cream wide trouser'],['OUTERWEAR','Grey trench']] },
];
const WEEK = [['MON','27',0,'Tailored'],['TUE','28',3,'Indigo'],['WED','29',1,'Camel',true],['THU','30',null,null],['FRI','31',null,null],['SAT','01',null,null],['SUN','02',null,null]];

function WebToday({ look, onShuffle, onNav }) {
  const L = WEB_LOOKS[look % WEB_LOOKS.length];
  return (
    <div>
      <PageBar title="Today" right={<>
        <WMono size={11} track={0.08} color="var(--slate-500)">WED · MAY 29 · 18° · MOSTLY CLEAR</WMono>
        <WIcon name="search" size={19} color="var(--slate-500)" />
      </>} />

      {/* editorial hero split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 460 }}>
        <div style={{ padding: '44px 44px 40px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 16, color: 'var(--slate-700)' }}>Good morning, Elise.</div>
          <WKicker marker style={{ marginTop: 32 }}>TODAY'S LOOK</WKicker>
          <WSerif size={56} style={{ marginTop: 14, letterSpacing: '-0.025em' }}>{L.statement[0]}<br />{L.statement[1]}</WSerif>

          <div style={{ marginTop: 'auto', paddingTop: 36 }}>
            <WKicker style={{ marginBottom: 6 }}>THE PIECES</WKicker>
            {L.pieces.map((p, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '13px 0', borderBottom: '1px solid var(--line-faint)' }}>
                <WSerif size={22}>{p[1]}</WSerif>
                <WMono size={9.5} track={0.12} color="var(--slate-400)">{p[0]}</WMono>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <WButton variant="dark" onClick={() => onNav('Planner')}>Wear this today</WButton>
              <WButton variant="outline" onClick={onShuffle}><WIcon name="shuffle" size={15} /> Shuffle</WButton>
            </div>
          </div>
        </div>

        {/* hero plate */}
        <WPlate idx={look} style={{ minHeight: 460 }}>
          <div style={{ position: 'absolute', left: 22, bottom: 20 }}>
            <WMono size={10} track={0.14} color="rgba(255,255,255,0.92)">{L.cap}</WMono>
          </div>
        </WPlate>
      </div>

      {/* this week */}
      <div style={{ borderTop: '1px solid var(--line)', padding: '30px 44px 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
          <WKicker>THIS WEEK</WKicker>
          <button onClick={() => onNav('Planner')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><WMono size={10} track={0.12} color="var(--slate-500)">PLAN THE WEEK →</WMono></button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 14 }}>
          {WEEK.map(([d, n, idx, name, today], i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <WMono size={9.5} track={0.1} color={today ? 'var(--ink)' : 'var(--slate-400)'}>{d}</WMono>
                <WMono size={9.5} track={0.05} color="var(--slate-300)">{n}</WMono>
              </div>
              {idx !== null
                ? <><WPlate idx={idx} fold style={{ width: '100%', aspectRatio: 0.8, outline: today ? '1.5px solid var(--ink)' : 'none', outlineOffset: 2 }} /><WSerif size={15} style={{ marginTop: 7 }}>{name}</WSerif></>
                : <div style={{ width: '100%', aspectRatio: 0.8, border: '1px dashed var(--line-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><WMono size={9} track={0.1} color="var(--slate-300)">＋ PLAN</WMono></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { WebToday, WEB_LOOKS, WEEK });
