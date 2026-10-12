'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Award, Factory, Palette, Ruler } from 'lucide-react';

import { defaultHero, HeroConfig } from '@/lib/hero-config';
const promiseIcons = [Palette, Award, Factory, Ruler];

export default function HeroSection({ config = defaultHero }: { config?: HeroConfig }) {
  const slides = config.slides.filter(slide => slide.enabled);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { setReducedMotion(query.matches); if (query.matches) setPaused(true); };
    update(); query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (!config.autoplay || slides.length < 2 || paused || hovered || focused) return;
    const timer = window.setInterval(() => { if (!document.hidden) setActive(current => (current + 1) % slides.length); }, config.interval);
    return () => window.clearInterval(timer);
  }, [paused, hovered, focused, active, config.autoplay, config.interval, slides.length]);
  const current = slides[active % slides.length];
  if (!config.enabled || !current) return null;
  return (
    <section className="atelier-hero" aria-labelledby="hero-title" aria-roledescription="carousel" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}>
      {slides.map((slide, index) => <div key={slide.id} className={'atelier-hero__photo atelier-hero__slide' + (index === active % slides.length ? ' is-active' : '')} style={{ backgroundImage: 'url(' + JSON.stringify(slide.image) + ')', backgroundPosition: slide.position + '% center', transitionDuration: reducedMotion ? '0ms' : undefined }} role="img" aria-label={slide.alt} aria-hidden={index !== active % slides.length} />)}
      <div className="atelier-hero__veil" />
      <div className="atelier-hero__inner">
        <div className="atelier-hero__copy">
          <span key={active + "-eyebrow"} className="atelier-eyebrow">{current.eyebrow}</span>
          <h1 key={active + "-heading"} id="hero-title">{current.heading.map((line, index) => <span key={index}>{index > 0 && <br />}{line}</span>)}</h1>
          <p key={active + "-description"}>{current.description}</p>
          <div className="atelier-hero__actions">
            {current.primaryLabel && <Link href={current.primaryHref || "/products"} className="atelier-button atelier-button--dark">{current.primaryLabel} <ArrowRight size={15} /></Link>}
            {current.secondaryLabel && <Link href={current.secondaryHref || "/custom-design"} className="atelier-button atelier-button--light">{current.secondaryLabel} <ArrowRight size={15} /></Link>}
          </div>
          {config.showPromises && <div className="atelier-promises">
            {config.promises.map(({ title, detail }, index) => { const Icon = promiseIcons[index]; return (
              <div className="atelier-promise" key={index}>
                <Icon size={18} strokeWidth={1.7} />
                <span><b>{title}</b><small>{detail}</small></span>
              </div>
            ); })}
          </div>}
        </div>

      </div>
    </section>
  );
}
