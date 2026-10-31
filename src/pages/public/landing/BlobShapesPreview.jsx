import { useState } from 'react';
import { ACTIVE_BLOB, ORGANIC_SHAPES, RECOMMENDED_BLOB } from './organicShapes.js';
import './BlobShapesPreview.css';

const SHAPES = Object.entries(ORGANIC_SHAPES).filter(([name]) => name.startsWith('blobBrujula'));

export default function BlobShapesPreview() {
  const [selected, setSelected] = useState(ACTIVE_BLOB);
  const [showGrid, setShowGrid] = useState(false);
  const [width, setWidth] = useState(1440);
  const [copied, setCopied] = useState(false);

  const chooseShape = async (name) => {
    setSelected(name);
    setCopied(false);
    try {
      await navigator.clipboard.writeText(name);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="blob-preview">
      <header className="blob-preview__header">
        <div>
          <p>CDISFRUTA · PRUEBA DE FORMAS</p>
          <h1>Curvas para nuestra brújula</h1>
          <span>Compara los recortes con la misma fotografía y el acento de fruta.</span>
        </div>
        <div className="blob-preview__controls">
          <label className="blob-preview__toggle"><input type="checkbox" checked={showGrid} onChange={(event) => setShowGrid(event.target.checked)} /> Mostrar cuadrícula</label>
          <div className="blob-preview__sizes" aria-label="Ancho de referencia">
            {[1440, 768, 375].map((size) => <button type="button" key={size} aria-pressed={width === size} onClick={() => setWidth(size)}>{size}px</button>)}
          </div>
        </div>
      </header>

      <section className="blob-preview__selected" aria-label="Vista ampliada de la forma seleccionada">
        <div className="blob-preview__selected-heading"><strong>Vista ampliada · {selected}</strong><span>Ancho de referencia: {width}px</span></div>
        <div className="blob-preview__selected-stage" style={{ '--selected-width': `${width}px`, '--preview-clip': `url(#preview-${selected})` }}>
          <div className={`blob-preview__photo${showGrid ? ' has-grid' : ''}`}><img src="/img/ubate-iglesia.webp" alt="Iglesia de Ubaté" /></div>
          <img className="blob-preview__fruit" src="/img/frutas-decorativas.webp" alt="" aria-hidden="true" />
        </div>
      </section>

      <section className="blob-preview__grid" aria-label="Variantes de forma">
        {SHAPES.map(([name, path], index) => {
          const number = index + 1;
          return (
            <article className={`blob-preview__card${selected === name ? ' is-selected' : ''}`} key={name}>
              <div className="blob-preview__card-title">
                <strong>Forma {number}</strong>
                {name === RECOMMENDED_BLOB && <span>Recomendada</span>}
              </div>
              <div className="blob-preview__stage-wrap">
                <div className="blob-preview__stage" style={{ '--stage-width': `${Math.min(width, 480)}px`, '--preview-clip': `url(#preview-${name})` }}>
                  <div className={`blob-preview__photo${showGrid ? ' has-grid' : ''}`}>
                    <img src="/img/ubate-iglesia.webp" alt="Iglesia de Ubaté" />
                  </div>
                  <img className="blob-preview__fruit" src="/img/frutas-decorativas.webp" alt="" aria-hidden="true" />
                </div>
              </div>
              <button type="button" className="blob-preview__use" onClick={() => chooseShape(name)}>{selected === name ? 'Seleccionada' : 'Usar esta forma'}</button>
              {selected === name && <p className="blob-preview__copied" aria-live="polite">{copied ? `${name} copiada al portapapeles.` : name}</p>}
              {selected === name && <pre>{path}</pre>}
            </article>
          );
        })}
      </section>
      <svg className="blob-preview__defs" aria-hidden="true">
        <defs>{SHAPES.map(([name, path]) => <clipPath id={`preview-${name}`} clipPathUnits="objectBoundingBox" key={name}><path d={path} /></clipPath>)}</defs>
      </svg>
    </main>
  );
}
