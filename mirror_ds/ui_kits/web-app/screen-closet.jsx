/* screen-closet.jsx (web) — wardrobe grid */

const WEB_CLOSET = [
  ['OUTERWEAR','Outerwear','Camel wool coat',22,0],['OUTERWEAR','Outerwear','Grey trench',5,3],
  ['KNITWEAR','Knitwear','Ivory ribbed crew',9,4],['KNITWEAR','Knitwear','Oat oversized knit',11,5],
  ['TAILORING','Tailoring','Charcoal blazer',17,1],['TAILORING','Tailoring','Black wide suit',3,2],
  ['DENIM','Denim','Straight indigo',28,3],['DENIM','Denim','Washed wide leg',13,0],
  ['TROUSERS','Trousers','Pleated wide-leg',14,2],['TROUSERS','Trousers','Cream trouser',8,4],
  ['KNITWEAR','Knitwear','Fine merino tee',6,1],['OUTERWEAR','Outerwear','Quilted black',7,5],
];
const WEB_FILTERS = ['All', 'Outerwear', 'Knitwear', 'Tailoring', 'Denim', 'Trousers'];

function WebCloset({ onNav }) {
  const [f, setF] = React.useState('All');
  const items = f === 'All' ? WEB_CLOSET : WEB_CLOSET.filter(i => i[1] === f);
  return (
    <div>
      <PageBar title="Closet" right={<>
        <WMono size={11} track={0.08} color="var(--slate-500)">84 PIECES · 11 ON ROTATION</WMono>
        <WIcon name="search" size={19} color="var(--slate-500)" />
      </>} />
      <div style={{ display: 'flex', gap: 9, padding: '22px 44px 4px', flexWrap: 'wrap' }}>
        {WEB_FILTERS.map(x => <WPill key={x} active={f === x} onClick={() => setF(x)}>{x}</WPill>)}
      </div>
      <div style={{ padding: '24px 44px 52px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', columnGap: 22, rowGap: 36 }}>
        {items.map((it, i) => <WGarment key={i} idx={it[4]} cat={it[0]} name={it[2]} worn={it[3]} onClick={() => onNav('Today')} />)}
      </div>
    </div>
  );
}

Object.assign(window, { WebCloset, WEB_CLOSET });
