import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './VideoGallery3D.css';

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5.5v13l10-6.5-10-6.5Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

function FilmIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="4" y="6" width="24" height="20" rx="3" />
      <path d="M4 12h24M4 20h24M10 6v20M22 6v20" />
    </svg>
  );
}

/** Posición relativa al foco: -1 izquierda, 0 centro, +1 derecha (cíclico). */
function relativeSlot(index, active, total) {
  if (total <= 1) return 0;
  let delta = index - active;
  if (delta > total / 2) delta -= total;
  if (delta < -total / 2) delta += total;
  return delta;
}

export default function VideoGallery3D({ videos = [], title = 'nuestra pasión', loading = false }) {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const videoRefs = useRef(new Map());
  const playButtonRefs = useRef(new Map());
  const cardRefs = useRef(new Map());
  const closeButtonRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const cleanVideos = useMemo(
    () => videos.filter((video) => video?.src && video?.title),
    [videos]
  );
  const activeVideo = playingIndex == null ? null : cleanVideos[playingIndex];
  const featured = cleanVideos[activeIndex];
  const titleWords = String(title).trim().split(/\s+/).filter(Boolean);
  const titleLead = titleWords[0] || 'nuestra';
  const titleRest = titleWords.slice(1).join(' ') || 'pasión';

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
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.unobserve(node);
      },
      { threshold: 0.12 }
    );
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

  const onStagePointer = (event) => {
    if (reducedMotion || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -8, y: px * 10 });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  const goTo = (index) => {
    const next = ((index % cleanVideos.length) + cleanVideos.length) % cleanVideos.length;
    setActiveIndex(next);
    cardRefs.current.get(next)?.focus();
  };

  if (!cleanVideos.length) return null;

  return (
    <div
      className="video-gallery"
      ref={sectionRef}
      data-visible={visible}
      data-reduced-motion={reducedMotion}
      data-count={cleanVideos.length}
    >
      {loading ? (
        <div className="video-gallery__skeleton" aria-label="Cargando videos">
          <span />
          <span />
          <span />
        </div>
      ) : (
        <>
          <header className="video-gallery__intro">
            <p className="video-gallery__eyebrow">
              <FilmIcon />
              <span>Escena en profundidad</span>
            </p>
            <div className="video-gallery__intro-copy">
              <h2 className="video-gallery__title">
                <em>{titleLead}</em>
                <strong>{titleRest}</strong>
              </h2>
              <p className="video-gallery__lead">
                Un escenario 3D con las historias de CDISFRUTA. Elige un fotograma
                lateral y salta al frente; pulsa reproducir para verlo en grande.
              </p>
            </div>
            <div className="video-gallery__progress" aria-hidden="true">
              <span>{String(activeIndex + 1).padStart(2, '0')}</span>
              <i />
              <span>{String(cleanVideos.length).padStart(2, '0')}</span>
            </div>
          </header>

          <div
            className="video-gallery__stage"
            ref={stageRef}
            onMouseMove={onStagePointer}
            onMouseLeave={resetTilt}
          >
            <div className="video-gallery__floor" aria-hidden="true" />
            <div className="video-gallery__beam" aria-hidden="true" />

            <div
              className="video-gallery__scene"
              style={{
                '--tilt-x': `${tilt.x}deg`,
                '--tilt-y': `${tilt.y}deg`,
              }}
              role="listbox"
              aria-label="Historias en video"
              aria-activedescendant={`video-card-${activeIndex}`}
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight') {
                  event.preventDefault();
                  goTo(activeIndex + 1);
                }
                if (event.key === 'ArrowLeft') {
                  event.preventDefault();
                  goTo(activeIndex - 1);
                }
              }}
            >
              {cleanVideos.map((video, index) => {
                const slot = relativeSlot(index, activeIndex, cleanVideos.length);
                const isFront = slot === 0;
                const depth = Math.abs(slot);
                return (
                  <article
                    key={video.src}
                    id={`video-card-${index}`}
                    className={`video-gallery__card${isFront ? ' is-front' : ''}`}
                    style={{
                      '--slot': slot,
                      '--depth': depth,
                      '--card-delay': `${index * 90}ms`,
                    }}
                    role="option"
                    aria-selected={isFront}
                    tabIndex={isFront ? 0 : -1}
                    ref={(node) => {
                      if (node) cardRefs.current.set(index, node);
                      else cardRefs.current.delete(index);
                    }}
                    onClick={() => {
                      if (!isFront) goTo(index);
                    }}
                    onKeyDown={(event) => {
                      if ((event.key === 'Enter' || event.key === ' ') && !isFront) {
                        event.preventDefault();
                        goTo(index);
                      }
                    }}
                  >
                    <div className="video-gallery__card-face">
                      {video.img && (
                        <img
                          className="video-gallery__thumbnail"
                          src={video.img}
                          alt={video.alt || `Miniatura: ${video.title}`}
                          width="900"
                          height="1200"
                          loading="lazy"
                          decoding="async"
                          onError={(event) => {
                            event.currentTarget.hidden = true;
                          }}
                        />
                      )}
                      <span className="video-gallery__veil" aria-hidden="true" />
                      <span className="video-gallery__index" aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="video-gallery__card-copy">
                        <p>Historia</p>
                        <h3>{video.title}</h3>
                      </div>

                      {isFront && (
                        <button
                          className="video-gallery__play"
                          type="button"
                          aria-label={`Reproducir video: ${video.title}`}
                          ref={(node) => {
                            if (node) playButtonRefs.current.set(index, node);
                            else playButtonRefs.current.delete(index);
                          }}
                          onClick={(event) => {
                            event.stopPropagation();
                            setPlayingIndex(index);
                          }}
                        >
                          <span className="video-gallery__play-orb">
                            <PlayIcon />
                          </span>
                          <span className="video-gallery__play-text">
                            Reproducir
                            <small>En escena</small>
                          </span>
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            {cleanVideos.length > 1 && (
              <div className="video-gallery__controls">
                <button
                  type="button"
                  className="video-gallery__nav"
                  aria-label="Historia anterior"
                  onClick={() => goTo(activeIndex - 1)}
                >
                  ‹
                </button>
                <div className="video-gallery__dots" role="tablist" aria-label="Elegir historia">
                  {cleanVideos.map((video, index) => (
                    <button
                      key={`dot-${video.src}`}
                      type="button"
                      role="tab"
                      aria-selected={index === activeIndex}
                      aria-label={`Mostrar: ${video.title}`}
                      className={`video-gallery__dot${index === activeIndex ? ' is-active' : ''}`}
                      onClick={() => goTo(index)}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className="video-gallery__nav"
                  aria-label="Historia siguiente"
                  onClick={() => goTo(activeIndex + 1)}
                >
                  ›
                </button>
              </div>
            )}
          </div>

          {featured && (
            <p className="video-gallery__now-playing" aria-live="polite">
              En primer plano: <strong>{featured.title}</strong>
            </p>
          )}

          {activeVideo &&
            createPortal(
              <div
                className="video-gallery__modal"
                role="presentation"
                onMouseDown={(event) => {
                  if (event.target === event.currentTarget) setPlayingIndex(null);
                }}
              >
                <section
                  className="video-gallery__modal-panel"
                  role="dialog"
                  aria-modal="true"
                  aria-label={`Reproduciendo: ${activeVideo.title}`}
                >
                  <div className="video-gallery__modal-header">
                    <p>{activeVideo.title}</p>
                    <button
                      className="video-gallery__modal-close"
                      type="button"
                      ref={closeButtonRef}
                      onClick={() => setPlayingIndex(null)}
                      aria-label="Cerrar video"
                    >
                      <CloseIcon />
                    </button>
                  </div>
                  <video
                    className="video-gallery__modal-video"
                    ref={(node) => {
                      if (node) videoRefs.current.set(playingIndex, node);
                      else videoRefs.current.delete(playingIndex);
                    }}
                    src={activeVideo.src}
                    controls
                    playsInline
                    autoPlay
                    preload="metadata"
                    aria-label={activeVideo.title}
                  />
                </section>
              </div>,
              document.body
            )}
        </>
      )}
    </div>
  );
}
