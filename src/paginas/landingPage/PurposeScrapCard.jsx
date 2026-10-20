import './PurposeScrapCard.css';

function HandDrawnIcon({ type }) {
  return (
    <svg className="purpose-scrap__icon" viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <path className="purpose-scrap__icon-ring" d="M51 7C75 7 93 25 92 51c-1 23-18 42-42 42C26 93 8 75 8 51 8 27 26 8 51 7Z" />
      {type === 'mision' ? (
        <path d="M50 78V49m0 10c-16 0-25-11-24-27 15 0 25 9 26 23m-1 5c1-17 12-26 28-26 0 16-10 27-28 27" />
      ) : (
        <><path d="M20 50s11-19 30-19 30 19 30 19-11 19-30 19S20 50 20 50Z" /><circle cx="50" cy="50" r="8" /><path d="M50 11v8m0 62v8M11 50h8m62 0h8M23 23l6 6m42 42 6 6M77 23l-6 6M29 71l-6 6" /></>
      )}
      <circle cx="15" cy="30" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="84" cy="69" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function BrushStroke({ className = '' }) {
  return <svg className={`purpose-scrap__stroke ${className}`} viewBox="0 0 300 36" fill="none" aria-hidden="true"><path d="M5 28C65 4 116 13 169 8c46-4 78 2 124-5M49 32c67-15 145-9 206-15" stroke="currentColor" strokeWidth="5" strokeLinecap="round" /></svg>;
}

function LeafSprig({ className = '' }) {
  return <svg className={`purpose-scrap__sprig ${className}`} viewBox="0 0 150 125" fill="none" aria-hidden="true"><path d="M10 112C45 80 77 49 137 12M43 81C20 84 11 72 11 53c20 1 32 12 32 28Zm26-24C65 34 76 20 98 14c2 22-9 36-29 43Zm-2 2C46 58 37 44 39 25c20 2 31 14 31 34Zm28-27c4 18 17 25 34 21-4-18-16-26-34-21Z" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function Glints({ className = '' }) {
  return <svg className={`purpose-scrap__glints ${className}`} viewBox="0 0 70 70" fill="none" aria-hidden="true"><path d="m14 14 20 19M7 36l22-1m7-28 2 20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg>;
}

function PaperMission({ item, visible, index }) {
  return (
    <article className={`purpose-scrap purpose-scrap--mission${visible ? ' is-visible' : ''}`} style={{ '--scrap-delay': `${index * 120}ms` }}>
      <figure className="purpose-scrap__mission-photo">
        <img src={item.image} alt={item.alt} loading="lazy" onError={(event) => { event.currentTarget.style.visibility = 'hidden'; }} />
        <Glints className="purpose-scrap__mission-glints" />
      </figure>
      {/* Las hojas se mantienen fuera de los elementos recortados para quedar sobre la foto y el papel. */}
      <LeafSprig className="purpose-scrap__mission-leaves" />
      <div className="purpose-scrap__paper">
        <span className="purpose-scrap__tape" aria-hidden="true" />
        <span className="sr-only">{item.eyebrow}</span>
        <HandDrawnIcon type={item.icon} />
        <h3 className="purpose-scrap__hand-title purpose-scrap__hand-title--mission"><span>Nuestra</span>Misión</h3>
        <BrushStroke className="purpose-scrap__title-stroke" />
        <h4 className="purpose-scrap__original-title">{item.title}</h4>
        <p className="purpose-scrap__description">{item.description}</p>
        <BrushStroke className="purpose-scrap__footer-stroke" />
      </div>
    </article>
  );
}

function PaintedVision({ item, visible, index }) {
  return (
    <article className={`purpose-scrap purpose-scrap--vision${visible ? ' is-visible' : ''}`} style={{ '--scrap-delay': `${index * 120}ms` }}>
      <div className="purpose-scrap__paint">
        <div className="purpose-scrap__vision-copy">
          <span className="sr-only">{item.eyebrow}</span>
          <HandDrawnIcon type={item.icon} />
          <h3 className="purpose-scrap__hand-title purpose-scrap__hand-title--vision"><span>Nuestra</span>Visión</h3>
          <BrushStroke className="purpose-scrap__title-stroke" />
          <h4 className="purpose-scrap__original-title">{item.title}</h4>
          <p className="purpose-scrap__description">{item.description}</p>
          <BrushStroke className="purpose-scrap__footer-stroke" />
        </div>
        <figure className="purpose-scrap__polaroid">
          <span className="purpose-scrap__clothespin" aria-hidden="true" />
          <img src={item.image} alt={item.alt} loading="lazy" onError={(event) => { event.currentTarget.style.visibility = 'hidden'; }} />
          <figcaption>{item.caption || 'Sabor de nuestra tierra'} <span aria-hidden="true">♡</span></figcaption>
        </figure>
      </div>
      {/* Adornos hermanos del fondo: pueden superponerse sin quedar recortados por la mancha. */}
      <Glints className="purpose-scrap__vision-glints" />
      <LeafSprig className="purpose-scrap__vision-leaves" />
    </article>
  );
}

export default function PurposeScrapCard({ item, visible, index }) {
  return item.id === 'mision'
    ? <PaperMission item={item} visible={visible} index={index} />
    : <PaintedVision item={item} visible={visible} index={index} />;
}
