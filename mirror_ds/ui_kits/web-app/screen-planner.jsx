/* screen-planner.jsx (web) — weekly outfit planner */

const PLAN = [
  ['MON', 'MAY 27', 0, 'Tailored grey', 'OFFICE'],
  ['TUE', 'MAY 28', 3, 'Indigo, easy', 'WFH'],
  ['WED', 'MAY 29', 1, 'The camel coat', 'OFFICE', true],
  ['THU', 'MAY 30', null, null, null],
  ['FRI', 'MAY 31', 4, 'All cream', 'DINNER'],
  ['SAT', 'JUN 01', null, null, null],
  ['SUN', 'JUN 02', null, null, null],
];

function WebPlanner({ onNav }) {
  return (
    <div>
      <PageBar title="Planner" right={<>
        <WMono size={11} track={0.08} color="var(--slate-500)">WEEK OF MAY 27 · 18–21°</WMono>
        <WButton variant="outline" onClick={() => onNav('Today')} style={{ padding: '11px 18px' }}><WIcon name="sparkles" size={14} /> Auto-plan</WButton>
      </>} />
      <div style={{ padding: '30px 44px 52px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 16 }}>
          {PLAN.map(([d, date, idx, name, occ, today], i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ paddingBottom: 12, marginBottom: 14, borderBottom: today ? '1.5px solid var(--ink)' : '1px solid var(--line)' }}>
                <WMono size={11} track={0.12} color={today ? 'var(--ink)' : 'var(--slate-500)'}>{d}</WMono>
                <WMono size={9} track={0.06} color="var(--slate-300)" style={{ display: 'block', marginTop: 4 }}>{date}</WMono>
              </div>
              {idx !== null ? (
                <div>
                  <WPlate idx={idx} fold style={{ width: '100%', aspectRatio: 0.74, outline: today ? '1.5px solid var(--ink)' : 'none', outlineOffset: 2 }}>
                    <div style={{ position: 'absolute', left: 8, bottom: 7 }}><WMono size={7.5} track={0.12} color="rgba(255,255,255,0.9)">{occ}</WMono></div>
                  </WPlate>
                  <WSerif size={16} style={{ marginTop: 9 }}>{name}</WSerif>
                </div>
              ) : (
                <button onClick={() => onNav('Closet')} style={{ width: '100%', aspectRatio: 0.74, border: '1px dashed var(--line-strong)', background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background .15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--fill-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <WIcon name="plus" size={18} color="var(--slate-400)" />
                  <WMono size={8.5} track={0.1} color="var(--slate-400)">PLAN</WMono>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { WebPlanner, PLAN });
