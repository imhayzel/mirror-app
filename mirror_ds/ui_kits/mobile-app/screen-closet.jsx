/* screen-closet.jsx — the wardrobe grid */

const CLOSET = [
  { cat: 'OUTERWEAR', group: 'Outerwear', name: 'Camel wool coat', worn: 22, idx: 0 },
  { cat: 'OUTERWEAR', group: 'Outerwear', name: 'Grey trench', worn: 5, idx: 3 },
  { cat: 'KNITWEAR', group: 'Knitwear', name: 'Ivory ribbed crew', worn: 9, idx: 4 },
  { cat: 'KNITWEAR', group: 'Knitwear', name: 'Oat oversized knit', worn: 11, idx: 5 },
  { cat: 'TAILORING', group: 'Tailoring', name: 'Charcoal blazer', worn: 17, idx: 1 },
  { cat: 'TAILORING', group: 'Tailoring', name: 'Black wide suit', worn: 3, idx: 2 },
  { cat: 'DENIM', group: 'Denim', name: 'Straight indigo', worn: 28, idx: 3 },
  { cat: 'DENIM', group: 'Denim', name: 'Washed wide leg', worn: 13, idx: 0 },
  { cat: 'TROUSERS', group: 'Trousers', name: 'Pleated wide-leg', worn: 14, idx: 2 },
  { cat: 'TROUSERS', group: 'Trousers', name: 'Cream trouser', worn: 8, idx: 4 },
  { cat: 'KNITWEAR', group: 'Knitwear', name: 'Fine merino tee', worn: 6, idx: 1 },
  { cat: 'OUTERWEAR', group: 'Outerwear', name: 'Quilted black', worn: 7, idx: 5 },
];
const FILTERS = ['All', 'Outerwear', 'Knitwear', 'Tailoring', 'Denim', 'Trousers'];

function ClosetScreen({ active, onTab, onOpenOutfit }) {
  const [filter, setFilter] = React.useState('All');
  const items = filter === 'All' ? CLOSET : CLOSET.filter(i => i.group === filter);
  return (
    <Screen
      top={<TopBar center="Closet" serif right={<Icon name="search" size={19} />} />}
      bottom={<TabBar active={active} onChange={onTab} />}
      pad={false}
    >
      {/* stats */}
      <div style={{ padding: '20px 20px 14px' }}>
        <Serif size={30}>84 pieces.</Serif>
        <Mono size={11} track={0.08} color="var(--slate-400)" style={{ display: 'block', marginTop: 7 }}>
          11 ON ROTATION · 6 NOT WORN THIS SEASON
        </Mono>
      </div>

      {/* filter pills — horizontal scroll */}
      <div className="noscroll" style={{ display: 'flex', gap: 9, overflowX: 'auto', padding: '4px 20px 18px' }}>
        {FILTERS.map(f => (
          <Pill key={f} active={filter === f} onClick={() => setFilter(f)}>{f}</Pill>
        ))}
      </div>

      {/* grid */}
      <div style={{ padding: '0 20px 28px', display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 14, rowGap: 24 }}>
        {items.map((it, i) => (
          <GarmentTile key={i} idx={it.idx} cat={it.cat} name={it.name} worn={it.worn} onClick={onOpenOutfit} />
        ))}
      </div>
    </Screen>
  );
}

Object.assign(window, { ClosetScreen, CLOSET });
