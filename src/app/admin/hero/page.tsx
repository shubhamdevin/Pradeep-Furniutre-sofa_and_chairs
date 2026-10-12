import { getHeroConfig } from '@/lib/hero-store';
import HeroManager from '@/components/admin/HeroManager';
export const dynamic='force-dynamic';
export default async function HeroAdmin(){return <HeroManager initial={await getHeroConfig()}/>;}
