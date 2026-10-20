import { useEffect, useRef, useState } from 'react';
import { tw } from '../../funciones/tw.js';

const PURPOSE_ITEMS = [
  {
    id: 'mision',
    number: '01',
    eyebrow: 'Nuestra misión',
    title: 'Bienestar que nace de la tierra',
    description: 'Transformamos frutas de nuestra región en snacks y aromáticas naturales, elaborados con cuidado junto a familias campesinas, para compartir bienestar y sabor auténtico.',
    icon: 'seed',
  },
  {
    id: 'vision',
    number: '02',
    eyebrow: 'Nuestra visión',
    title: 'El sabor de Ubaté llega más lejos',
    description: 'Queremos ser una marca colombiana reconocida por innovar con productos naturales, fortalecer el origen campesino y llevar el sabor de Ubaté a nuevos mercados.',
    icon: 'compass',
  },
];

function PurposeIcon({ type }) {
  return <svg aria-hidden="true" viewBox="0 0 48 48" fill="none" className={tw('h-8 w-8')}>
    {type === 'seed' ? <>
      <path d="M24 40V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 27c-9 0-14-5-14-13 8 0 14 4 14 13Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M24 22c0-8 5-13 14-13 0 8-5 13-14 13Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M17 40h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </> : <>
      <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 4" />
      <path d="m28 19-3 8-7 3 3-8 7-3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M24 5v4M43 24h-4M24 43v-4M5 24h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>}
  </svg>;
}

export default function MissionVision() {
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [tilt, setTilt] = useState({});
  const sectionRef = useRef(null);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      setReducedMotion(query.matches);
      if (query.matches) setVisible(true);
    };
    sync();
    query.addEventListener?.('change', sync);
    return () => query.removeEventListener?.('change', sync);
  }, []);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.unobserve(node);
      }
    }, { threshold: 0.18 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const updateTilt = (event, id) => {
    if (reducedMotion || event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    setTilt((previous) => ({ ...previous, [id]: { x: x * 100, y: y * 100, rx: (0.5 - y) * 6, ry: (x - 0.5) * 6 } }));
  };

  return <section id="features" ref={sectionRef} aria-labelledby="purpose-heading" className={tw('scroll-mt-24 relative isolate overflow-hidden bg-[#fffaf5] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24')}>
    <div aria-hidden="true" className={tw('pointer-events-none absolute -right-28 -top-36 -z-10 size-[420px] rounded-full bg-[radial-gradient(circle,rgba(232,96,60,.13),transparent_68%)]')} />
    <div className={tw('mx-auto max-w-6xl')}>
      <header className={tw('mb-9 max-w-3xl sm:mb-12')}>
        <p className={tw('mb-3 text-xs font-bold uppercase tracking-[.18em] text-[#E8603C]')}>Nuestra brújula</p>
        <h2 id="purpose-heading" className={tw('text-3xl font-extrabold tracking-[-.03em] text-[#2D1B0A] sm:text-4xl lg:text-5xl')}>Un propósito que crece con la tierra</h2>
        <p className={tw('mt-4 max-w-2xl text-sm leading-7 text-[#8B6652] sm:text-base')} style={{ fontFamily: 'var(--font-mono)' }}>Tradición campesina, ideas frescas y una mirada puesta en el futuro.</p>
      </header>

      <div className={tw('relative grid gap-5 md:grid-cols-2 md:gap-7')}>
        <div aria-hidden="true" className={tw('pointer-events-none absolute left-1/2 top-1/2 hidden h-px w-[42%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#E8603C]/40 to-transparent md:block')} />
        {PURPOSE_ITEMS.map((item, index) => {
          const motion = reducedMotion ? null : tilt[item.id];
          return <article key={item.id} onPointerMove={(event) => updateTilt(event, item.id)} onPointerLeave={() => setTilt((previous) => ({ ...previous, [item.id]: null }))}
            style={{
              opacity: visible || reducedMotion ? 1 : 0,
              transform: reducedMotion ? 'none' : motion ? `perspective(1000px) rotateX(${motion.rx}deg) rotateY(${motion.ry}deg) translateY(-4px)` : `translateY(${visible ? 0 : 20}px)`,
              transitionDelay: reducedMotion ? '0ms' : `${index * 140}ms`,
              backgroundImage: motion ? `radial-gradient(circle at ${motion.x}% ${motion.y}%, rgba(232,96,60,.12), transparent 44%), linear-gradient(135deg,#fff 0%,#fff9f2 100%)` : 'linear-gradient(135deg,#fff 0%,#fff9f2 100%)',
            }}
            className={tw('group relative min-w-0 overflow-hidden rounded-[28px] border border-[#edd9ca] p-6 shadow-[0_16px_42px_rgba(93,54,31,.08)] transition-[opacity,transform,box-shadow,border-color] duration-700 ease-out hover:-translate-y-1 hover:border-[#E8603C]/50 hover:shadow-[0_24px_55px_rgba(168,83,46,.16)] focus-within:ring-2 focus-within:ring-[#E8603C]/50 sm:p-8 lg:p-10 motion-reduce:transition-none')}>
            <div aria-hidden="true" className={tw('absolute -right-12 -top-12 size-36 rounded-full border border-[#E8603C]/15 transition-transform duration-700 group-hover:scale-110 motion-reduce:transition-none')} />
            <div className={tw('relative flex items-start justify-between gap-4')}>
              <span className={tw('grid size-14 shrink-0 place-items-center rounded-2xl bg-[#fff0e9] text-[#E8603C] shadow-[inset_0_0_0_1px_rgba(232,96,60,.12)] transition-transform duration-500 group-hover:rotate-[-5deg] group-hover:scale-105 motion-reduce:transition-none')}><PurposeIcon type={item.icon} /></span>
              <span className={tw('font-mono text-xs tracking-[.16em] text-[#b28c73]')}>{item.number}</span>
            </div>
            <div className={tw('relative mt-7')}>
              <p className={tw('text-[11px] font-bold uppercase tracking-[.18em] text-[#E8603C]')}>{item.eyebrow}</p>
              <h3 className={tw('mt-2 text-xl font-extrabold leading-tight tracking-[-.02em] text-[#2D1B0A] sm:text-2xl')}>{item.title}</h3>
              <p className={tw('mt-4 max-w-xl text-sm leading-7 text-[#765843] sm:text-base sm:leading-8')}>{item.description}</p>
            </div>
            <div aria-hidden="true" className={tw('relative mt-7 flex items-center gap-2')}>
              <span className={tw('h-1 w-9 rounded-full bg-[#E8603C]')} />
              <span className={tw('h-px flex-1 bg-gradient-to-r from-[#E8603C]/40 to-transparent')} />
              <span className={tw('size-2 rounded-full bg-[#E8603C]/70 shadow-[0_0_14px_rgba(232,96,60,.55)]')} />
            </div>
          </article>;
        })}
      </div>
    </div>
  </section>;
}
