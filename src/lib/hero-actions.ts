'use server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { validSession } from './admin-session';
import { HeroConfig } from './hero-config';
import { writeHeroConfig } from './hero-store';
export async function saveHeroConfig(input:HeroConfig) {
 try {
  if(!await validSession(cookies().get('atelier_admin')?.value)) throw new Error('Please sign in again.');
  const text=(v:unknown,max:number)=>{if(typeof v!=='string'||v.length>max)throw new Error('Please shorten the text in your slides.');return v.trim()};
  const url=(v:unknown)=>{const s=text(v,2000);if(s&&!/^\/(?!\/)/.test(s)&&!/^https?:\/\//i.test(s))throw new Error('Use a /local-path or an https URL.');return s};
  if(!Array.isArray(input.slides)||input.slides.length<1||input.slides.length>12)throw new Error('Keep between 1 and 12 slides.');
  if(!Number.isFinite(input.interval)||input.interval<3000||input.interval>30000)throw new Error('Slide timing must be 3–30 seconds.');
  if(!Array.isArray(input.promises)||input.promises.length!==4)throw new Error('Four feature labels are required.');
  const slides=input.slides.map(s=>{
   if(!Array.isArray(s.heading)||s.heading.length<1||s.heading.length>3)throw new Error('Use 1–3 heading lines.');
   const heading=s.heading.map(line=>text(line,45)).filter(Boolean);
   const image=url(s.image);if(!image||!heading.length)throw new Error('Every slide needs an image and heading.');
   if(!Number.isFinite(s.position)||s.position<0||s.position>100)throw new Error('Invalid image position.');
   const primaryLabel=text(s.primaryLabel,50),primaryHref=url(s.primaryHref),secondaryLabel=text(s.secondaryLabel,50),secondaryHref=url(s.secondaryHref);
   if((primaryLabel&&!primaryHref)||(secondaryLabel&&!secondaryHref))throw new Error('Add a destination for each button.');
   return {id:text(s.id,100),enabled:!!s.enabled,image,alt:text(s.alt,250),eyebrow:text(s.eyebrow,100),heading,description:text(s.description,400),position:s.position,primaryLabel,primaryHref,secondaryLabel,secondaryHref};
  });
  if(!slides.some(s=>s.enabled))throw new Error('Keep at least one slide enabled.');
  await writeHeroConfig({enabled:!!input.enabled,autoplay:!!input.autoplay,interval:input.interval,showPromises:!!input.showPromises,slides,promises:input.promises.map(p=>({title:text(p.title,40),detail:text(p.detail,70)}))});
  revalidatePath('/');revalidatePath('/admin/hero');return {success:true,error:''};
 }catch(error:any){return {success:false,error:error.message||'Unable to save hero.'};}
}
