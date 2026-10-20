import { useEffect, useMemo, useRef, useState } from 'react';
import './VideoGallery3D.css';

function LeafIcon() {
  return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M5 26C6 13 15 6 28 5c0 13-7 22-20 23m-3 2c5-9 11-15 19-21" /></svg>;
}

function CameraIcon() {
  return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="3.5" y="8" width="17" height="16" rx="3" /><path d="m20.5 13 8-4v14l-8-4" /><circle cx="12" cy="16" r="4" /></svg>;
}

function PlayIcon({ playing }) {
  return playing
    ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM15 5h4v14h-4z" /></svg>
    : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10-6.5-10-6.5Z" /></svg>;
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

function shortestOffset(index, activeIndex, count) {
  if (count <= 1 || index === activeIndex) return 0;
  if (count === 2) return 1;
  let offset = (index - activeIndex + count) % count;
  if (offset > count / 2) offset -= count;
  return offset;
}

export default function VideoGallery3D({ videos = [], title = 'nuestra pasión', loading = false }) {
  const sectionRef = useRef(null);
  const videoRefs = useRef(new Map());
  const swipeStart = useRef(null);
  const ignoreNextClick = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(() => typeof window === 'undefined' ? 1280 : window.innerWidth);
  const cleanVideos = useMemo(() => videos.filter((video) => video?.src && video?.title), [videos]);
  const titleParts = splitTitle(title);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    const resize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', resize, { passive: true });
    return () => window.removeEventListener('resize', resize);
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
    setActiveIndex((current) => cleanVideos.length ? current % cleanVideos.length : 0);
    setPlayingIndex(null);
  }, [cleanVideos.length]);

  useEffect(() => {
    if (playingIndex == null) return undefined;
    const video = videoRefs.current.get(playingIndex);
    if (!video) return undefined;
    video.muted = false;
    video.play().catch(() => {
      video.muted = true;
      video.play().catch(() => setPlayingIndex(null));
    });
    return () => {
      video.pause();
      video.currentTime = 0;
    };
  }, [playingIndex]);

  if (!cleanVideos.length) return null;
  const hasControls = cleanVideos.length > 1;
  const move = (direction) => {
    if (!hasControls) return;
    setPlayingIndex(null);
    setActiveIndex((index) => (index + direction + cleanVideos.length) % cleanVideos.length);
  };

  const handleCardClick = (index) => {
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;
    }
    if (playingIndex === index) setPlayingIndex(null);
    else {
      setActiveIndex(index);
      setPlayingIndex(index);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
  };

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse') return;
    swipeStart.current = { x: event.clientX, y: event.clientY };
  };
  const handlePointerUp = (event) => {
    if (!swipeStart.current) return;
    const deltaX = event.clientX - swipeStart.current.x;
    const deltaY = event.clientY - swipeStart.current.y;
    swipeStart.current = null;
    if (Math.abs(deltaX) < 42 || Math.abs(deltaX) < Math.abs(deltaY)) return;
    ignoreNextClick.current = true;
    window.setTimeout(() => { ignoreNextClick.current = false; }, 0);
    move(deltaX < 0 ? 1 : -1);
  };

  const handleTilt = (event) => {
    if (reducedMotion || viewportWidth < 1100 || !window.matchMedia('(pointer: fine)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    event.currentTarget.style.setProperty('--tilt-x', `${-y * 10}deg`);
    event.currentTarget.style.setProperty('--tilt-y', `${x * 10}deg`);
  };

  const resetTilt = (event) => {
    event.currentTarget.style.setProperty('--tilt-x', '0deg');
    event.currentTarget.style.setProperty('--tilt-y', '0deg');
  };

  const cardWidth = viewportWidth < 700 ? Math.min(viewportWidth * .72, 300) : Math.min(viewportWidth * .24, 310);
  const cardGap = viewportWidth < 700 ? cardWidth * .77 : cardWidth * 1.2;
  const sideAngle = viewportWidth < 700 ? 10 : viewportWidth < 1100 ? 12 : 18;

  return (
    <div className="video-gallery" ref={sectionRef} data-visible={visible} data-reduced-motion={reducedMotion}>
      {loading ? (
        <div className="video-gallery__skeleton" aria-label="Cargando videos">
          <span /><span /><span />
        </div>
      ) : (
        <>
          <div className="video-gallery__eyebrow">
            <LeafIcon />
            <span>Nuestra galería</span>
            <i aria-hidden="true" />
          </div>
          <header className="video-gallery__heading">
            <h2>
              {titleParts.second ? <><span>{titleParts.first}</span> <strong>{titleParts.second}</strong></> : <strong>{titleParts.first}</strong>}
            </h2>
            <svg className="video-gallery__underline" viewBox="0 0 400 24" fill="none" aria-hidden="true"><path d="M8 17C87 5 173 14 256 9c50-3 94-5 137-3" /></svg>
          </header>

          <div className="video-gallery__stage" role="region" aria-roledescription="carrusel" aria-label="Galería de videos" tabIndex={0} onKeyDown={handleKeyDown} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
            <div className="video-gallery__track">
              {cleanVideos.map((video, index) => {
                const offset = shortestOffset(index, activeIndex, cleanVideos.length);
                const active = offset === 0;
                const playing = playingIndex === index;
                const label = splitLabel(video.title);
                const angle = -Math.sign(offset) * sideAngle;
                const scale = active ? 1.06 : .88;
                const transform = `translateX(calc(-50% + ${offset * cardGap}px)) rotateY(${angle}deg) scale(${scale}) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))`;
                const cardOpacity = active ? 1 : Math.max(.18, .76 - Math.max(0, Math.abs(offset) - 1) * .2);
                return (
                  <button
                    className={`video-glass-card${active ? ' is-active' : ''}${playing ? ' is-playing' : ''}${offset ? ' is-side' : ''}`}
                    type="button"
                    key={video.src}
                    data-video-card
                    aria-label={`${playing ? 'Pausar' : 'Reproducir'} video: ${video.title}`}
                    aria-current={active ? 'true' : undefined}
                    style={{ '--card-offset': offset, '--card-transform': transform, '--card-entry-transform': `translateX(calc(-50% + ${offset * cardGap + Math.sign(offset) * 28}px)) rotateY(${angle}deg) scale(${scale})`, '--card-opacity': cardOpacity, '--entry-delay': `${.18 + Math.abs(offset) * .1}s`, zIndex: active ? 5 : Math.max(1, 4 - Math.abs(offset)), opacity: cardOpacity, filter: active ? 'brightness(1)' : `brightness(${Math.max(.55, 1 - Math.abs(offset) * .15)})` }}
                    onClick={() => handleCardClick(index)}
                    onPointerMove={active ? handleTilt : undefined}
                    onPointerLeave={resetTilt}
                  >
                    <span className="video-glass-card__image-wrap">
                      <span className="video-glass-card__placeholder" aria-hidden="true" />
                      {video.img && <img className="video-glass-card__thumbnail" src={video.img} alt={video.alt || ''} width="750" height="1000" loading="lazy" onError={(event) => { event.currentTarget.hidden = true; }} />}
                      {playing && <video className="video-glass-card__video" ref={(node) => { if (node) videoRefs.current.set(index, node); else videoRefs.current.delete(index); }} src={video.src} loop playsInline muted preload="none" />}
                      <span className={`video-glass-card__play${playing ? ' is-playing' : ''}`} aria-hidden="true"><PlayIcon playing={playing} /></span>
                      <span className="video-glass-card__caption">
                        <CameraIcon />
                        <span><span>{label.first}</span>{label.second && <strong>{label.second}</strong>}</span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            {hasControls && <>
              <button className="video-gallery__arrow video-gallery__arrow--prev" type="button" aria-label="Video anterior" onClick={() => move(-1)}><span aria-hidden="true">‹</span></button>
              <button className="video-gallery__arrow video-gallery__arrow--next" type="button" aria-label="Video siguiente" onClick={() => move(1)}><span aria-hidden="true">›</span></button>
            </>}
            {cleanVideos.length > 2 && <div className="video-gallery__pagination" aria-label="Seleccionar video">
              {cleanVideos.map((video, index) => <button key={video.src} className={index === activeIndex ? 'is-active' : ''} type="button" aria-label={`Ir al video ${index + 1}`} aria-current={index === activeIndex ? 'true' : undefined} onClick={() => { setPlayingIndex(null); setActiveIndex(index); }} />)}
            </div>}
          </div>
        </>
      )}
    </div>
  );
}
