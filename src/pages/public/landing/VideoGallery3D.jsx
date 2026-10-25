import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './VideoGallery3D.css';

function LeafIcon() {
  return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M5 26C6 13 15 6 28 5c0 13-7 22-20 23m-3 2c5-9 11-15 19-21" /></svg>;
}

function CameraIcon() {
  return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="3.5" y="8" width="17" height="16" rx="3" /><path d="m20.5 13 8-4v14l-8-4" /><circle cx="12" cy="16" r="4" /></svg>;
}

function PlayIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10-6.5-10-6.5Z" /></svg>;
}

function CloseIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>;
}

function splitTitle(title = '') {
  const words = String(title).trim().split(/\s+/).filter(Boolean);
  if (words.length < 2) return { first: words[0] || '', second: '' };
  const splitAt = Math.ceil(words.length / 2);
  return { first: words.slice(0, splitAt).join(' '), second: words.slice(splitAt).join(' ') };
}

function splitLabel(title = '') {
  const words = String(title).trim().split(/\s+/).filter(Boolean);
  if (words.length < 2) return { first: words[0] || '', second: '' };
  const splitAt = Math.ceil(words.length / 2);
  return { first: `${words.slice(0, splitAt).join(' ')}${splitAt < words.length ? ',' : ''}`, second: words.slice(splitAt).join(' ') };
}

export default function VideoGallery3D({ videos = [], title = 'nuestra pasión', loading = false }) {
  const sectionRef = useRef(null);
  const videoRefs = useRef(new Map());
  const playButtonRefs = useRef(new Map());
  const closeButtonRef = useRef(null);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const cleanVideos = useMemo(() => videos.filter((video) => video?.src && video?.title), [videos]);
  const titleParts = splitTitle(title);
  const galleryCount = cleanVideos.length === 1 ? 'one' : cleanVideos.length === 2 ? 'two' : 'mosaic';
  const activeVideo = playingIndex == null ? null : cleanVideos[playingIndex];

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || reducedMotion || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setVisible(true);
      observer.unobserve(node);
    }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  useEffect(() => {
    if (playingIndex == null) return undefined;
    const video = videoRefs.current.get(playingIndex);
    if (!video) return undefined;
    video.play().catch(() => {});
    return () => {
      video.pause();
      video.currentTime = 0;
    };
  }, [playingIndex]);

  useEffect(() => {
    if (playingIndex == null) return undefined;
    const playButtons = playButtonRefs.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setPlayingIndex(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
      playButtons.get(playingIndex)?.focus();
    };
  }, [playingIndex]);

  if (!cleanVideos.length) return null;

  return (
    <div className="video-gallery" ref={sectionRef} data-visible={visible} data-reduced-motion={reducedMotion}>
      {loading ? (
        <div className="video-gallery__skeleton" aria-label="Cargando videos"><span /><span /><span /></div>
      ) : (
        <>
          <div className="video-gallery__eyebrow">
            <LeafIcon />
            <span>Nuestra galería</span>
            <i aria-hidden="true" />
          </div>
          <div className="video-gallery__title-stage">
            <svg className="video-gallery__rays" viewBox="0 0 90 100" fill="none" aria-hidden="true"><path d="m15 18 22 19M5 48l27 1m4-42 4 26m27 7 17-15m-12 35 20-3" /></svg>
            <header className="video-gallery__heading">
              <h2>
                {titleParts.second ? <><span>{titleParts.first}</span><strong>{titleParts.second}</strong></> : <strong>{titleParts.first}</strong>}
              </h2>
              <svg className="video-gallery__underline" viewBox="0 0 400 24" fill="none" aria-hidden="true"><path d="M8 17C87 5 173 14 256 9c50-3 94-5 137-3" /></svg>
            </header>
            <aside className="video-gallery__aside" aria-label="Una historia en cada video">
              <span>en cada<br />video...</span>
              <span className="video-gallery__aside-play" aria-hidden="true"><PlayIcon /></span>
              <svg viewBox="0 0 92 70" fill="none" aria-hidden="true"><path d="M86 5C65 7 55 17 48 34 42 48 30 57 10 61m0 0 16-2M10 61l8-14" /></svg>
            </aside>
          </div>

          <div className={`video-gallery__grid video-gallery__grid--${galleryCount}`}>
            {cleanVideos.map((video, index) => {
              const label = splitLabel(video.title);
              return (
                <article className="video-gallery__tile" key={video.src} style={{ '--tile-delay': `${index * 90}ms` }}>
                  <div className="video-gallery__tile-media">
                    <span className="video-gallery__placeholder" aria-hidden="true" />
                    {video.img && <img className="video-gallery__thumbnail" src={video.img} alt={video.alt || `Miniatura: ${video.title}`} width="750" height="1000" loading="lazy" decoding="async" onError={(event) => { event.currentTarget.hidden = true; }} />}
                    <button className="video-gallery__play-button" type="button" aria-label={`Reproducir video: ${video.title}`} ref={(node) => { if (node) playButtonRefs.current.set(index, node); else playButtonRefs.current.delete(index); }} onClick={() => setPlayingIndex(index)}>
                      <span className="video-gallery__play-icon"><PlayIcon /></span>
                      <span className="video-gallery__play-label">Reproducir historia</span>
                    </button>
                    <span className="video-gallery__tile-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                    <span className="video-gallery__caption" aria-hidden="true">
                      <CameraIcon />
                      <span><span>{label.first}</span>{label.second && <strong>{label.second}</strong>}</span>
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
          {activeVideo && createPortal(
            <div className="video-gallery__modal" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setPlayingIndex(null); }}>
              <section className="video-gallery__modal-panel" role="dialog" aria-modal="true" aria-label={`Reproduciendo: ${activeVideo.title}`}>
                <div className="video-gallery__modal-header">
                  <p>{activeVideo.title}</p>
                  <button className="video-gallery__modal-close" type="button" ref={closeButtonRef} onClick={() => setPlayingIndex(null)} aria-label="Cerrar video"><CloseIcon /></button>
                </div>
                <video className="video-gallery__modal-video" ref={(node) => { if (node) videoRefs.current.set(playingIndex, node); else videoRefs.current.delete(playingIndex); }} src={activeVideo.src} controls playsInline autoPlay preload="metadata" aria-label={activeVideo.title} />
              </section>
            </div>,
            document.body
          )}
        </>
      )}
    </div>
  );
}
