'use client';
import { useState } from 'react';
import { ArrowUp, ArrowDown, Plus, Trash2, Save, Upload, ImageIcon } from 'lucide-react';
import { HeroConfig, HeroSlide, defaultHero } from '@/lib/hero-config';
import { saveHeroConfig } from '@/lib/hero-actions';
import HeroSection from '@/components/home/HeroSection';
export default function HeroManager({initial}:{initial:HeroConfig}) {
 const [config,setConfig]=useState(initial),[selected,setSelected]=useState(0),[busy,setBusy]=useState(false),[uploading,setUploading]=useState(false),[message,setMessage]=useState(''),[dirty,setDirty]=useState(false);
 const slide=config.slides[selected];
 function change(next:HeroConfig){setConfig(next);setDirty(true);setMessage('');}
 function patch(values:Partial<HeroSlide>){change({...config,slides:config.slides.map((s,i)=>i===selected?{...s,...values}:s)});}
 function move(direction:number){const next=selected+direction;if(next<0||next>=config.slides.length)return;const slides=[...config.slides];[slides[selected],slides[next]]=[slides[next],slides[selected]];change({...config,slides});setSelected(next);}
 const field=(label:string,key:'image'|'alt'|'eyebrow'|'description'|'primaryLabel'|'primaryHref'|'secondaryLabel'|'secondaryHref')=><label>{label}{key==='description'?<textarea value={slide[key]} maxLength={400} onChange={e=>patch({[key]:e.target.value})}/>:<input value={slide[key]} onChange={e=>patch({[key]:e.target.value})}/>}</label>;
 return <div className="hero-manager">
  <div className="hero-manager-heading"><div><span className="atelier-eyebrow">WEBSITE CONTENT</span><h1>Hero manager</h1><p>Edit your homepage slideshow. Changes go live when you save.</p></div><button className="admin-action" disabled={busy||uploading} onClick={async()=>{setBusy(true);setMessage('');try{const result=await saveHeroConfig(config);setMessage(result.success?'Hero saved. Your homepage is updated.':result.error);if(result.success)setDirty(false);}catch{setMessage('Could not save. Please try again.');}finally{setBusy(false);}}}><Save size={16}/>{busy?'Saving…':'Save changes'}</button></div>
  <p role="status">{message || (dirty?'You have unsaved changes.':'All changes saved.')}</p>
  <fieldset disabled={busy||uploading} className="hero-editor-fields">
   <section className="hero-settings admin-resource">
    <label><input type="checkbox" checked={config.enabled} onChange={e=>change({...config,enabled:e.target.checked})}/> Show hero on homepage</label>
    <label><input type="checkbox" checked={config.autoplay} onChange={e=>change({...config,autoplay:e.target.checked})}/> Automatic slideshow</label>
    <label>Seconds per slide<input type="number" min={3} max={30} step={0.5} value={config.interval/1000} onChange={e=>change({...config,interval:Number(e.target.value)*1000})}/></label>
    <label><input type="checkbox" checked={config.showPromises} onChange={e=>change({...config,showPromises:e.target.checked})}/> Show feature labels</label>
   </section>
   <div className="hero-edit-grid">
    <aside className="admin-resource hero-slide-list"><h2>Slides ({config.slides.length})</h2>{config.slides.map((s,i)=><button type="button" key={s.id} className={i===selected?'is-active':''} onClick={()=>setSelected(i)}><ImageIcon size={16}/><span>{i+1}. {s.eyebrow||'Untitled slide'}<small>{s.enabled?'Visible':'Hidden'}</small></span></button>)}<button type="button" disabled={config.slides.length>=12} onClick={()=>{change({...config,slides:[...config.slides,{...defaultHero.slides[0],id:'slide-'+Date.now()+'-'+Math.random().toString(36).slice(2),eyebrow:'NEW COLLECTION'}]});setSelected(config.slides.length);}}><Plus size={16}/>Add slide</button></aside>
    <section className="admin-resource hero-slide-editor">
     <div className="hero-editor-toolbar"><h2>Slide {selected+1}</h2><button title="Move earlier" aria-label="Move slide earlier" disabled={selected===0} onClick={()=>move(-1)}><ArrowUp size={17}/></button><button title="Move later" aria-label="Move slide later" disabled={selected===config.slides.length-1} onClick={()=>move(1)}><ArrowDown size={17}/></button><button title="Remove slide" aria-label="Remove slide" disabled={config.slides.length===1} onClick={()=>{change({...config,slides:config.slides.filter((_,i)=>i!==selected)});setSelected(Math.max(0,selected-1));}}><Trash2 size={17}/></button></div>
     <label><input type="checkbox" checked={slide.enabled} onChange={e=>patch({enabled:e.target.checked})}/> Enable this slide</label>
     <label className="hero-upload"><Upload size={16}/> Upload image (PNG, JPEG, WebP · max 8 MB)<input type="file" accept="image/png,image/jpeg,image/webp" onChange={async e=>{const file=e.target.files?.[0];if(!file)return;setUploading(true);setMessage('Uploading image…');try{const body=new FormData();body.append('file',file);const res=await fetch('/api/admin/hero-upload',{method:'POST',body});const data=await res.json();if(!res.ok)throw new Error(data.error);patch({image:data.url});}catch(error:any){setMessage(error.message||'Upload failed.');}finally{setUploading(false);e.target.value='';}}}/></label>
     {field('Image URL or local path','image')}{field('Image description (accessibility)','alt')}
     <label>Image focal position: {slide.position}%<input type="range" min={0} max={100} value={slide.position} onChange={e=>patch({position:Number(e.target.value)})}/></label>
     {field('Eyebrow / tagline','eyebrow')}
     <label>Heading (up to 3 lines)<textarea rows={3} value={slide.heading.join('\n')} onChange={e=>patch({heading:e.target.value.split('\n')})}/></label>
     {field('Description','description')}
     <div className="hero-button-fields">{field('Primary button text','primaryLabel')}{field('Primary button link','primaryHref')}{field('Secondary button text','secondaryLabel')}{field('Secondary button link','secondaryHref')}</div><small>Leave button text empty to hide that button.</small>
    </section>
   </div>
   <section className="admin-resource hero-features"><h2>Feature labels below the buttons</h2><div>{config.promises.map((p,i)=><div key={i}><label>Label {i+1}<input value={p.title} onChange={e=>change({...config,promises:config.promises.map((v,j)=>j===i?{...v,title:e.target.value}:v)})}/></label><label>Supporting text<input value={p.detail} onChange={e=>change({...config,promises:config.promises.map((v,j)=>j===i?{...v,detail:e.target.value}:v)})}/></label></div>)}</div></section>
  </fieldset>
  <section className="hero-admin-preview"><h2>Selected slide preview</h2><HeroSection key={slide.id} config={{...config,enabled:true,autoplay:false,slides:[{...slide,enabled:true}]}}/></section>
 </div>;
}
