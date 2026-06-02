/* screen-you.jsx — profile / style identity + settings */

function YouScreen({ active, onTab }) {
  const stats = [['PIECES', '84'], ['OUTFITS WORN', '212'], ['MOST WORN', 'STRAIGHT INDIGO'], ['NEVER WORN', '6']];
  const settings = [
    ['sparkles', 'Style profile', 'MINIMAL · NEUTRAL'],
    ['calendar', 'Outfit history', ''],
    ['cloud-sun', 'Weather & location', 'AUTO'],
    ['heart', 'Saved fits', '14'],
    ['settings', 'Preferences', ''],
  ];
  return (
    <Screen
      top={<TopBar center="You" serif right={<Icon name="settings" size={19} />} />}
      bottom={<TabBar active={active} onChange={onTab} />}
      pad={false}
    >
      {/* identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '24px 20px 22px' }}>
        <Plate idx={5} style={{ width: 76, height: 76, borderRadius: 999, flexShrink: 0 }} />
        <div>
          <Serif size={30}>Elise Tan</Serif>
          <Mono size={10} track={0.12} color="var(--slate-400)" style={{ display: 'block', marginTop: 5 }}>MINIMAL · NEUTRAL · TAILORED</Mono>
        </div>
      </div>

      <Divider />

      {/* stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid var(--line)' }}>
        {stats.map(([k, v], i) => (
          <div key={i} style={{ padding: '18px 20px', borderRight: i % 2 === 0 ? '1px solid var(--line-faint)' : 'none', borderBottom: i < 2 ? '1px solid var(--line-faint)' : 'none' }}>
            <Mono size={9.5} track={0.12} color="var(--slate-400)">{k}</Mono>
            <Serif size={24} style={{ marginTop: 6 }}>{v}</Serif>
          </div>
        ))}
      </div>

      {/* settings list */}
      <div style={{ padding: '6px 20px 28px' }}>
        {settings.map(([icon, label, detail], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '17px 0', borderBottom: '1px solid var(--line-faint)' }}>
            <Icon name={icon} size={19} color="var(--slate-700)" />
            <div style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 16.5, color: 'var(--ink)' }}>{label}</div>
            {detail && <Mono size={10} track={0.08} color="var(--slate-400)">{detail}</Mono>}
            <Icon name="chevron-right" size={15} color="var(--slate-300)" />
          </div>
        ))}
      </div>
    </Screen>
  );
}

Object.assign(window, { YouScreen });
