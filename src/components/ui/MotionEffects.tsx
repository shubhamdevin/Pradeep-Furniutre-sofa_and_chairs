'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
export default function MotionEffects(){
 const pathname=usePathname();
 useEffect(()=>{
  if(pathname.startsWith('/admin')||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const elements=Array.from(document.querySelectorAll<HTMLElement>('main section:not(.atelier-hero), .atelier-category-card, .atelier-product-grid > *, .atelier-image-grid > *'));
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-revealed');observer.unobserve(entry.target)}}),{threshold:0.08});
  elements.forEach((el,i)=>{if(el.getBoundingClientRect().top>window.innerHeight*.9){el.classList.add('scroll-reveal');el.style.setProperty('--reveal-delay',`${Math.min(i%4,3)*65}ms`);observer.observe(el)}});
  return()=>{observer.disconnect();elements.forEach(el=>{el.classList.remove('scroll-reveal','is-revealed');el.style.removeProperty('--reveal-delay')})};
 },[pathname]);return null;
}
