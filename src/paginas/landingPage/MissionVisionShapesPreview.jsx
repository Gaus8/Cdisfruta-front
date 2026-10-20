import { useState } from 'react';
import { MISION_SHAPES, VISION_SHAPES, ACTIVE_MISION_SHAPE, ACTIVE_VISION_SHAPE, ORGANIC_SHAPES } from './organicShapes.js';
import './MissionVisionShapesPreview.css';

function VariantGroup({ title, names, image, initial }) {
  const [selected, setSelected] = useState(initial);
  const [copied, setCopied] = useState(false);

  const choose = async (name) => {
    setSelected(name);
    try {
      await navigator.clipboard.writeText(name);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="mv-shape-preview__group">
      <h2>{title}</h2>
      <div className="mv-shape-preview__grid">
        {names.map((name, index) => (
          <article className={`mv-shape-preview__card${name === selected ? ' is-selected' : ''}`} key={name}>
            <div className="mv-shape-preview__caption"><strong>Forma {String(index + 1).padStart(2, '0')}</strong>{name === initial && <span>Recomendada</span>}</div>
            <div className={`mv-shape-preview__sample${title.includes('Visión') ? ' is-paint' : ''}`}>
              {title.includes('Visión')
                ? <div className="mv-shape-preview__paint-sample" style={{ clipPath: `url(#mv-preview-${name})` }} aria-label="Muestra de forma pintada" role="img" />
                : <img src={image} alt="Vista previa de la forma aplicada a la foto de Misión" style={{ clipPath: `url(#mv-preview-${name})` }} />}
            </div>
            <code>{name}</code>
            <button type="button" onClick={() => choose(name)}>{name === selected ? 'Seleccionada' : 'Usar esta forma'}</button>
            {name === selected && <small aria-live="polite">{copied ? 'Identificador copiado al portapapeles.' : 'Identificador: ' + name}</small>}
          </article>
        ))}
      </div>
    </section>
  );
}

export default function MissionVisionShapesPreview() {
  return (
    <main className="mv-shape-preview">
      <header><p>CDISFRUTA · LABORATORIO VISUAL</p><h1>Formas para Misión y Visión</h1><span>Compara las curvas con las fotografías reales de la sección.</span></header>
      <VariantGroup title="Foto orgánica · Misión" names={MISION_SHAPES} image="/img/cdisfruta_06.webp" initial={ACTIVE_MISION_SHAPE} />
      <VariantGroup title="Mancha pintada · Visión" names={VISION_SHAPES} image="/img/cdisfruta_07.webp" initial={ACTIVE_VISION_SHAPE} />
      <svg className="mv-shape-preview__defs" aria-hidden="true"><defs>{[...MISION_SHAPES, ...VISION_SHAPES].map((name) => <clipPath id={`mv-preview-${name}`} clipPathUnits="objectBoundingBox" key={name}><path d={ORGANIC_SHAPES[name]} /></clipPath>)}</defs></svg>
    </main>
  );
}
