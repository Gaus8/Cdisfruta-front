import { useEffect, useRef, useState } from 'react';
import { FaCloudUploadAlt, FaSave } from 'react-icons/fa';
import { useBlocker } from 'react-router-dom';
import { apiAxios } from '../../funciones/conexion';
import '../../assets/styles/dashboardAdmin/diseno_portada.css';

const initialSlides = [
  { eyebrow: 'Presencia internacional', etiqueta: 'Presencia internacional', titulo: 'CDISFRUTA en Australia', desc: 'Nuestras aromáticas llegando a nuevos destinos. Sabor colombiano presente en Melbourne.', tag: 'Australia · Melbourne', detalle: 'Nuestra expansión internacional comenzó con el sueño de llevar el sabor de Ubaté al mundo. Hoy, nuestras infusiones se disfrutan en Melbourne por diversas familias, destacando por su origen natural y procesos artesanales.', img: '/img/cdisfruta_01.webp', iconKey: 'globe' },
  { eyebrow: 'Producto destacado', etiqueta: 'Producto destacado', titulo: 'Aromáticas frutales', desc: 'Infusiones naturales elaboradas con frutas seleccionadas, que brindan sabor, frescura y bienestar en cada taza.', tag: '100% Natural', detalle: 'Seleccionamos cada fruta en su punto exacto de maduración. Nuestro proceso de deshidratado lento conserva todas las propiedades vitamínicas y el aroma intenso que nos caracteriza.', img: '/img/cdisfruta_02.webp', iconKey: 'leaf' },
  { eyebrow: 'Nuestra tierra', etiqueta: 'Nuestra tierra', titulo: 'Tradición de Ubaté', desc: 'Reflejamos la riqueza de nuestra tierra en cada mezcla, con frutas y hierbas cuidadosamente seleccionadas.', tag: 'Ubaté · Cundinamarca', detalle: 'CDISFRUTA nace en el corazón de la provincia de Ubaté. Trabajamos de la mano con productores locales, asegurando frescura y apoyando el crecimiento de nuestra comunidad campesina.', img: '/img/cdisfruta_07.webp', iconKey: 'location' }
];

const fieldLimits = { eyebrow: 32, etiqueta: 26, titulo: 64, desc: 180, tag: 28, detalle: 500 };
const makeSnapshot = (slides) => JSON.stringify(slides.map(({ eyebrow, etiqueta, titulo, desc, tag, detalle, img, iconKey }) => ({ eyebrow, etiqueta, titulo, desc, tag, detalle, img, iconKey })));
const cleanSlides = (slides) => slides.map(({ _id, __v, ...slide }) => ({ ...slide, etiqueta: slide.etiqueta || slide.eyebrow }));

export default function DisenoPortada() {
  const [slides, setSlides] = useState(initialSlides);
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [savedSnapshot, setSavedSnapshot] = useState(null);
  const refs = useRef([]);
  const isDirty = savedSnapshot !== null && (makeSnapshot(slides) !== savedSnapshot || Object.keys(files).length > 0);
  const blocker = useBlocker(isDirty);

  useEffect(() => {
    apiAxios.get('/portada').then(({ data }) => {
      if (Array.isArray(data) && data.length === 3) {
        const loaded = cleanSlides(data);
        setSlides(loaded); setSavedSnapshot(makeSnapshot(loaded));
      }
    }).catch(() => {
      const fallback = cleanSlides(initialSlides);
      setSlides(fallback); setSavedSnapshot(makeSnapshot(fallback));
      setMessage({ type: 'error', text: 'No fue posible cargar la portada. Se muestran los textos predeterminados.' });
    })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!isDirty) return undefined;
    const warnBeforeUnload = (event) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warnBeforeUnload);
    return () => window.removeEventListener('beforeunload', warnBeforeUnload);
  }, [isDirty]);

  const changeField = (index, key, value) => setSlides(current => current.map((slide, i) => i === index ? { ...slide, [key]: value } : slide));

  const selectImage = async (index, file) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setMessage({ type: 'error', text: 'Usa una imagen JPG, PNG o WebP.' }); return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'La imagen supera el máximo permitido de 5 MB.' }); return;
    }
    try {
      const dimensions = await new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
        image.onerror = reject;
        image.src = URL.createObjectURL(file);
      });
      if (dimensions.width < 1200 || dimensions.height < 800) {
        setMessage({ type: 'error', text: 'La imagen debe medir al menos 1200 × 800 px. Recomendado: 1600 × 1000 px.' }); return;
      }
      setFiles(current => ({ ...current, [index]: file }));
      changeField(index, 'img', URL.createObjectURL(file));
      setMessage(null);
    } catch {
      setMessage({ type: 'error', text: 'No se pudo leer la imagen seleccionada.' });
    }
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true); setMessage(null);
    try {
      const form = new FormData();
      form.append('slides', JSON.stringify(slides));
      Object.entries(files).forEach(([index, file]) => form.append(`imagen_${index}`, file));
      const { data } = await apiAxios.put('/admin/portada', form);
      const saved = cleanSlides(data);
      setSlides(saved);
      setFiles({});
      setSavedSnapshot(makeSnapshot(saved));
      setMessage({ type: 'success', text: 'La portada se actualizó correctamente.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'No se pudo guardar la portada. Inténtalo de nuevo.' });
    } finally { setSaving(false); }
  };

  if (loading) return <div className="cover-editor-loading">Cargando contenido de portada…</div>;

  return (
    <form className="cover-editor" onSubmit={save}>
      <header className="cover-editor-header">
        <div><span className="cover-editor-kicker">Experiencia de marca</span><h1>Diseño de portada</h1><p>Administra las imágenes y los mensajes del carrusel principal de CDISFRUTA.</p></div>
      </header>
      <div className="cover-guidance"><strong>Guía de imágenes</strong><span>JPG, PNG o WebP · Máximo 5 MB · Mínimo 1200 × 800 px · Recomendado 1600 × 1000 px.</span></div>
      {message && <div className={`cover-feedback ${message.type}`} role="status">{message.text}</div>}
      <div className="cover-slide-list">
        {slides.map((slide, index) => (
          <section className="cover-slide-card" key={index}>
            <div className="cover-slide-heading"><span className="cover-slide-number">{String(index + 1).padStart(2, '0')}</span><div><h2>Diapositiva {index + 1}</h2><p>Este contenido aparece en el carrusel de inicio.</p></div></div>
            <div className="cover-slide-body">
              <div className="cover-image-column">
                <div className="cover-image-preview"><img src={slide.img} alt={`Vista previa diapositiva ${index + 1}`} /></div>
                <input ref={element => { refs.current[index] = element; }} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={event => { selectImage(index, event.target.files?.[0]); event.target.value = ''; }} />
                <button className="cover-image-button" type="button" onClick={() => refs.current[index]?.click()}><FaCloudUploadAlt /> Cambiar imagen</button>
                <small>La imagen se recorta para adaptarse a escritorio y móvil.</small>
              </div>
              <div className="cover-fields">
                <div className="cover-field-group">
                  <h3>Texto principal</h3>
                  <p>Aparece junto a la imagen en la página de inicio.</p>
                  {renderField(index, slide, 'eyebrow', 'Frase superior')}
                  {renderField(index, slide, 'titulo', 'Título principal')}
                  {renderField(index, slide, 'desc', 'Descripción breve')}
                </div>
                <details className="cover-collapsible cover-overlay-group">
                  <summary><span><strong>Cuadro flotante sobre la imagen</strong><small>Editar sus dos textos breves</small></span><span className="cover-expand-label">Desplegar</span></summary>
                  <div className="cover-collapsible-content">
                    <p>Textos cortos para que la etiqueta conserve su tamaño en escritorio y móvil.</p>
                    {renderField(index, slide, 'etiqueta', 'Frase de la etiqueta')}
                    {renderField(index, slide, 'tag', 'Texto inferior del cuadro')}
                  </div>
                </details>
                <details className="cover-collapsible cover-detail-group">
                  <summary><span><strong>Contenido de “Más información”</strong><small>Editar el texto que verá el cliente</small></span><span className="cover-expand-label">Desplegar</span></summary>
                  <div className="cover-collapsible-content">
                    <p>Este texto cambia junto con cada diapositiva y aparece al pulsar el botón.</p>
                    {renderField(index, slide, 'detalle', 'Descripción ampliada')}
                  </div>
                </details>
              </div>
            </div>
          </section>
        ))}
      </div>
      <div className="cover-editor-bottom"><span>Los cambios se reflejan en la página principal después de guardar.</span></div>
      <div className="cover-save-dock"><span className={isDirty ? 'pending' : 'saved'}>{saving ? 'Guardando cambios…' : isDirty ? 'Tienes cambios sin guardar' : 'Todos los cambios están guardados'}</span><button className="cover-save-button" type="submit" disabled={saving || !isDirty}><FaSave /> {saving ? 'Guardando…' : 'Guardar cambios'}</button></div>
      {blocker.state === 'blocked' && <div className="cover-unsaved-overlay" role="presentation"><section className="cover-unsaved-modal" role="dialog" aria-modal="true" aria-labelledby="cover-unsaved-title"><span className="cover-unsaved-icon">!</span><h2 id="cover-unsaved-title">Tienes cambios sin guardar</h2><p>Si sales ahora, las modificaciones de la portada se perderán.</p><div><button type="button" className="cover-stay-button" onClick={() => blocker.reset()}>Seguir editando</button><button type="button" className="cover-discard-button" onClick={() => blocker.proceed()}>Salir sin guardar</button></div></section></div>}
    </form>
  );

  function renderField(index, slide, key, label) {
    const multiline = ['desc', 'detalle'].includes(key);
    const limit = fieldLimits[key];
    return <label className="cover-character-field" key={key}>{label}{multiline ? <textarea required maxLength={limit} value={slide[key] || ''} onChange={event => changeField(index, key, event.target.value)} rows={key === 'detalle' ? 4 : 2} /> : <input required maxLength={limit} value={slide[key] || ''} onChange={event => changeField(index, key, event.target.value)} />}<small className="cover-character-count">{(slide[key] || '').length}/{limit} caracteres</small></label>;
  }
}
