import { NextRequest, NextResponse } from 'next/server';
import { validSession } from '@/lib/admin-session';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
export const runtime='nodejs';
export const dynamic = 'force-dynamic';
export async function POST(req:NextRequest){
 try{
  if(!await validSession(req.cookies.get('atelier_admin')?.value))return NextResponse.json({error:'Please sign in.'},{status:401});
  const data=await req.formData();const file=data.get('file');
  if(!(file instanceof File)||!file.size||file.size>8*1024*1024)return NextResponse.json({error:'Choose an image under 8 MB.'},{status:400});
  const bytes=Buffer.from(await file.arrayBuffer());
  const ext=bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))?'png':bytes[0]===255&&bytes[1]===216&&bytes[2]===255?'jpg':bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP'?'webp':null;
  if(!ext)return NextResponse.json({error:'Use a PNG, JPEG or WebP image.'},{status:400});
  const directory=path.join(process.cwd(),'public','images','hero-uploads');await mkdir(directory,{recursive:true});
  const name=randomUUID()+'.'+ext;await writeFile(path.join(directory,name),bytes);
  return NextResponse.json({url:'/images/hero-uploads/'+name});
 }catch{return NextResponse.json({error:'Upload failed. Please retry.'},{status:500});}
}
