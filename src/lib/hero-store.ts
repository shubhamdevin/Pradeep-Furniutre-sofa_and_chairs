import 'server-only';
import { readFile, mkdir, writeFile, rename } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { defaultHero, HeroConfig } from './hero-config';
const directory = path.join(process.cwd(), 'data');
const file = path.join(directory, 'hero.json');
export async function getHeroConfig():Promise<HeroConfig> {
  try { return JSON.parse(await readFile(file, 'utf8')); }
  catch(error:any) { if(error.code==='ENOENT') return defaultHero; throw error; }
}
export async function writeHeroConfig(config:HeroConfig) {
  await mkdir(directory,{recursive:true});
  const temporary = path.join(directory, 'hero-'+randomUUID()+'.tmp');
  await writeFile(temporary,JSON.stringify(config,null,2));
  await rename(temporary,file);
}
