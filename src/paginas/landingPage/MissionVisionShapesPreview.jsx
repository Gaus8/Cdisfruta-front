import { useMemo, useState } from 'react';
import PurposeScrapCard from './PurposeScrapCard.jsx';
import { PURPOSE_ITEMS } from './purposeItems.js';
import {
  ACTIVE_VISION_SHAPE_MOBILE,
  ACTIVE_VISION_SHAPE_TABLET,
  ACTIVE_VISION_SHAPE_DESKTOP,
  ORGANIC_SHAPES,
  VISION_MOBILE_SHAPES,
  VISION_TABLET_SHAPES,
  VISION_DESKTOP_SHAPES,
} from './organicShapes.js';
import './MissionVisionShapesPreview.css';

const RANGES = [
  { id: 'mobile', label: 'Móvil · 375 px', names: VISION_MOBILE_SHAPES, recommended: ACTIVE_VISION_SHAPE_MOBILE, recommendation: 'La 01 mantiene la forma vertical y deja el sello dentro de la curva superior.' },
  { id: 'tablet', label: 'Tablet · 768 px', names: VISION_TABLET_SHAPES, recommended: ACTIVE_VISION_SHAPE_TABLET, recommendation: 'La 01 conserva una onda equilibrada en una proporción intermedia.' },
  { id: 'desktop', label: 'Escritorio · 1440 px', names: VISION_DESKTOP_SHAPES, recommended: ACTIVE_VISION_SHAPE_DESKTOP, recommendation: 'La 01 da amplitud al lado del texto y reserva la derecha para la polaroid.' },
];
const INITIAL_SELECTIONS = Object.fromEntries(RANGES.map(({ id, recommended }) => [id, recommended]));
const VARIANT_NOTES = {
  visionShapeMobile1: 'Onda superior suave', visionShapeMobile2: 'Cresta desplazada', visionShapeMobile3: 'Vientre lateral amplio', visionShapeMobile4: 'Base más abierta', visionShapeMobile5: 'Contorno compacto',
  visionShapeTablet1: 'Onda equilibrada', visionShapeTablet2: 'Asimetría lateral', visionShapeTablet3: 'Cresta más amplia', visionShapeTablet4: 'Base más tendida',
  visionShapeDesktop1: 'Onda editorial amplia', visionShapeDesktop2: 'Cima desplazada', visionShapeDesktop3: 'Lateral más redondo', visionShapeDesktop4: 'Base inclinada',
};

function expandedDescription(description, amount) {
  if (amount === 0) return description;
  if (amount === 50) return `${description} ${description.split(' ').slice(0, Math.ceil(description.split(' ').length / 2)).join(' ')}…`;
  return `${description} ${description}`;
}

export default function MissionVisionShapesPreview() {
  const [rangeId, setRangeId] = useState('mobile');
  const [selections, setSelections] = useState(INITIAL_SELECTIONS);
  const [copied, setCopied] = useState(false);
  const [textAmount, setTextAmount] = useState(0);
  const [showSafeGrid, setShowSafeGrid] = useState(false);
  const range = RANGES.find(({ id }) => id === rangeId);
  const selected = selections[rangeId];
  const visionItem = PURPOSE_ITEMS.find(({ id }) => id === 'vision');
  const previewItem = useMemo(() => ({
    ...visionItem,
    description: expandedDescription(visionItem.description, textAmount),
  }), [textAmount, visionItem]);

  const selectShape = async (name) => {
    setSelections((previous) => ({ ...previous, [rangeId]: name }));
    setCopied(false);
    try {
      await navigator.clipboard.writeText(name);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const shapeStyle = { '--active-vision-shape': `url(#mission-vision-${selected})` };

  return (
    <main className="mv-shape-preview">
      <svg className="mv-shape-preview__defs" aria-hidden="true" focusable="false">
        <defs>{[...VISION_MOBILE_SHAPES, ...VISION_TABLET_SHAPES, ...VISION_DESKTOP_SHAPES].map((name) => (
          <clipPath id={`mission-vision-${name}`} clipPathUnits="objectBoundingBox" key={name}>
            <path d={ORGANIC_SHAPES[name]} />
          </clipPath>
        ))}</defs>
      </svg>
      <header className="mv-shape-preview__header">
        <p>CDISFRUTA · LABORATORIO VISUAL</p>
        <h1>Curvas de Nuestra Visión</h1>
        <span>Prueba las formas con el contenido real antes de elegir una variante.</span>
      </header>

      <nav className="mv-shape-preview__ranges" aria-label="Rango de pantalla">
        {RANGES.map((item) => <button type="button" className={item.id === rangeId ? 'is-active' : ''} key={item.id} onClick={() => { setRangeId(item.id); setCopied(false); }}>{item.label}</button>)}
      </nav>

      <section className="mv-shape-preview__workspace" aria-label={`Formas de Visión para ${range.label}`}>
        <div className={`mv-shape-preview__stage mv-shape-preview__stage--${rangeId}`} data-safe-grid={showSafeGrid}>
          <PurposeScrapCard item={previewItem} visible index={0} style={shapeStyle} />
          {showSafeGrid && <span className="mv-shape-preview__safe-grid" aria-hidden="true" />}
        </div>

        <aside className="mv-shape-preview__controls">
          <p className="mv-shape-preview__eyebrow">Variantes · {range.names.length}</p>
          <div className="mv-shape-preview__variants">
            {range.names.map((name, index) => (
              <button type="button" className={`mv-shape-preview__variant${name === selected ? ' is-selected' : ''}`} key={name} onClick={() => { setSelections((previous) => ({ ...previous, [rangeId]: name })); setCopied(false); }} aria-pressed={name === selected}>
                <span className="mv-shape-preview__swatch" style={{ clipPath: `url(#mission-vision-${name})` }} aria-hidden="true" />
                <span>Forma {String(index + 1).padStart(2, '0')}</span>
                <small>{VARIANT_NOTES[name]}</small>
                {name === range.recommended && <small>Recomendada</small>}
              </button>
            ))}
          </div>
          <button className="mv-shape-preview__use" type="button" onClick={() => selectShape(selected)}>Usar esta forma</button>
          <p className="mv-shape-preview__copy-status" aria-live="polite">{copied ? `Copiado: ${selected}` : `Seleccionada: ${selected}`}</p>
          <p className="mv-shape-preview__recommendation">{range.recommendation}</p>
          <label className="mv-shape-preview__label">Probar longitud del texto
            <select value={textAmount} onChange={(event) => setTextAmount(Number(event.target.value))}>
              <option value={0}>Texto original</option><option value={50}>Texto +50%</option><option value={100}>Texto +100%</option>
            </select>
          </label>
          <label className="mv-shape-preview__check"><input type="checkbox" checked={showSafeGrid} onChange={(event) => setShowSafeGrid(event.target.checked)} /> Mostrar zona segura (24 px)</label>
          <label className="mv-shape-preview__label">Path seleccionado
            <pre>{ORGANIC_SHAPES[selected]}</pre>
          </label>
          <div className="mv-shape-preview__constants"><strong>Constantes activas</strong><code>ACTIVE_VISION_SHAPE_MOBILE = '{ACTIVE_VISION_SHAPE_MOBILE}'</code><code>ACTIVE_VISION_SHAPE_TABLET = '{ACTIVE_VISION_SHAPE_TABLET}'</code><code>ACTIVE_VISION_SHAPE_DESKTOP = '{ACTIVE_VISION_SHAPE_DESKTOP}'</code></div>
        </aside>
      </section>
    </main>
  );
}
