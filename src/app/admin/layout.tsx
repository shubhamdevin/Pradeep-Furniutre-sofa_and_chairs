'use client';
import { useEffect, useState } from 'react';
import { ADMIN_AUTH_REQUIRED } from '@/lib/admin-access';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { GalleryHorizontalEnd, LayoutDashboard, UsersRound, PencilRuler, FileCheck2, Factory, PackageSearch, CalendarClock, Armchair, ArrowUpRight, LogOut, ShieldCheck, PanelLeftClose, PanelLeftOpen, ChevronRight, X, LoaderCircle } from 'lucide-react';

const groups = [
  { label: 'WORKSPACE', items: [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Hero manager', href: '/admin/hero', icon: GalleryHorizontalEnd },
    { label: 'Furniture catalogue', href: '/admin/products', icon: Armchair },
  ]},
  { label: 'CUSTOMER MANAGEMENT', items: [
    { label: 'Leads & enquiries', href: '/admin/leads', icon: UsersRound },
    { label: 'Design requests', href: '/admin/custom-requests', icon: PencilRuler },
    { label: 'Quotations', href: '/admin/quotations', icon: FileCheck2 },
    { label: 'Consultations', href: '/admin/consultations', icon: CalendarClock },
  ]},
  { label: 'OPERATIONS', items: [
    { label: 'Manufacturing', href: '/admin/manufacturing', icon: Factory },
    { label: 'Inventory & suppliers', href: '/admin/inventory', icon: PackageSearch },
  ]},
];

export default function AdminLayout({children}:{children:ReactNode}) {
  const pathname=usePathname();
  const [mobileOpen,setMobileOpen]=useState(false);
  const [collapsed,setCollapsed]=useState(false);
  const [signingOut,setSigningOut]=useState(false);
  const [error,setError]=useState('');
  const current=groups.flatMap(group=>group.items).find(item=>item.href===pathname);
  useEffect(()=>{setMobileOpen(false)},[pathname]);
  useEffect(()=>{if(!mobileOpen)return;const close=(event:KeyboardEvent)=>{if(event.key==='Escape')setMobileOpen(false)};document.addEventListener('keydown',close);return()=>document.removeEventListener('keydown',close)},[mobileOpen]);
  if(pathname==='/admin/login')return <div className="admin-login-shell">{children}</div>;
  return <div className={`admin-shell admin-workspace ${collapsed?'sidebar-collapsed':''}`}>
    <a href="#admin-content" className="admin-skip-link">Skip to content</a>
    {mobileOpen&&<button className="admin-sidebar-scrim" aria-label="Close navigation" onClick={()=>setMobileOpen(false)}/>}
    <aside id="admin-sidebar" className={`admin-sidebar ${mobileOpen?'is-open':''}`} aria-label="Administration">
      <Link href="/admin" className="admin-brand"><span className="admin-brand-symbol"><Armchair size={23} strokeWidth={1.7}/></span><span className="admin-sidebar-label"><strong>Pradeep<span className="admin-brand-dot">.</span></strong><small>FURNITURE ADMIN</small></span></Link>
      <button className="admin-mobile-close" onClick={()=>setMobileOpen(false)} aria-label="Close navigation"><X size={20}/></button>
      <div className="admin-workspace-label admin-sidebar-label"><span className="admin-workspace-dot"/>Management workspace</div>
      <nav aria-label="Admin navigation" className="admin-navigation">{groups.map(group=><div className="admin-nav-group" key={group.label}><p className="admin-sidebar-label">{group.label}</p>{group.items.map(item=>{const Icon=item.icon;const active=pathname===item.href;return <Link key={item.href} href={item.href} title={collapsed?item.label:undefined} aria-label={item.label} aria-current={active?'page':undefined} className={`admin-nav-link ${active?'is-active':''}`}><Icon size={19} strokeWidth={1.75} aria-hidden="true"/><span className="admin-sidebar-label">{item.label}</span>{active&&<span className="admin-nav-indicator admin-sidebar-label"/>}</Link>})}</div>)}</nav>
      <div className="admin-sidebar-bottom">
        <Link href="/" target="_blank" rel="noopener noreferrer" className="admin-nav-link" aria-label="Open website in new tab"><ArrowUpRight size={19}/><span className="admin-sidebar-label">Open website</span></Link>
        <div className="admin-account"><span className="admin-account-avatar">PA</span><span className="admin-sidebar-label"><strong>Administrator</strong><small>Super admin</small></span><ShieldCheck className="admin-sidebar-label" size={17}/></div>
        {ADMIN_AUTH_REQUIRED && <button className="admin-nav-link admin-signout" disabled={signingOut} aria-label="Sign out" onClick={async()=>{setSigningOut(true);setError('');try{const response=await fetch('/api/admin/logout',{method:'POST'});if(!response.ok)throw new Error();window.location.assign('/admin/login')}catch{setError('Sign out failed. Please retry.');setSigningOut(false)}}}>{signingOut?<LoaderCircle size={18} className="animate-spin"/>:<LogOut size={18}/>}<span className="admin-sidebar-label">{signingOut?'Signing out…':'Sign out'}</span></button>}
        {error&&<p role="alert" className="text-xs text-red-700 p-2">{error}</p>}
      </div>
    </aside>
    <div className="admin-main-column">
      <header className="admin-topbar"><div className="admin-topbar-start"><button className="admin-icon-button admin-desktop-toggle" aria-label={collapsed?'Expand sidebar':'Collapse sidebar'} aria-expanded={!collapsed} aria-controls="admin-sidebar" onClick={()=>setCollapsed(!collapsed)}>{collapsed?<PanelLeftOpen size={20}/>:<PanelLeftClose size={20}/>}</button><button className="admin-icon-button admin-mobile-toggle" aria-label="Open navigation" aria-expanded={mobileOpen} aria-controls="admin-sidebar" onClick={()=>setMobileOpen(true)}><PanelLeftOpen size={20}/></button><div className="admin-breadcrumb"><span>Workspace</span><ChevronRight size={14}/><strong>{current?.label||'Administration'}</strong></div></div><div className="admin-topbar-end"><span className="admin-access-badge"><ShieldCheck size={14}/>Super admin</span><span className="admin-topbar-avatar" title="Administrator">PA</span></div></header>
      <main id="admin-content" className="admin-content" tabIndex={-1}>{children}</main>
      <footer className="admin-workspace-footer"><span>Pradeep Furniture · Administration</span><span>Private workspace</span></footer>
    </div>
  </div>;
}
