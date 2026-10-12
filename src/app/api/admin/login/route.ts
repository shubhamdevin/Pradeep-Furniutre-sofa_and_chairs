import { ADMIN_AUTH_REQUIRED } from '@/lib/admin-access';
import {NextRequest,NextResponse} from 'next/server';
import {timingSafeEqual} from 'crypto';
import {signature} from '@/lib/admin-session';

export const dynamic = 'force-dynamic';

const attempts=new Map<string,{count:number;until:number}>();
export async function POST(req:NextRequest){
 try{
 if(req.headers.get('origin')&&req.headers.get('origin')!==req.nextUrl.origin)return NextResponse.json({error:'Invalid origin.'},{status:403});
 if(!ADMIN_AUTH_REQUIRED)return NextResponse.json({success:true});
 const ip=req.headers.get('x-forwarded-for')?.split(',')[0]||'local';const attempt=attempts.get(ip);
 if(attempt&&attempt.until>Date.now()&&attempt.count>=8)return NextResponse.json({error:'Too many attempts. Please wait 15 minutes.'},{status:429});
 const {password}=await req.json();const expected=process.env.ADMIN_PASSWORD;
 if(!expected)return NextResponse.json({error:'Configure ADMIN_PASSWORD and ADMIN_SESSION_SECRET first.'},{status:503});
 const input=Buffer.from(String(password||'')),actual=Buffer.from(expected);
 if(input.length!==actual.length||!timingSafeEqual(input,actual)){attempts.set(ip,{count:attempt&&attempt.until>Date.now()?attempt.count+1:1,until:Date.now()+900000});return NextResponse.json({error:'Incorrect admin password.'},{status:401});}
 attempts.delete(ip);const expires=String(Date.now()+8*60*60*1000);const token=expires+'.'+await signature(expires);const response=NextResponse.json({success:true});response.cookies.set('atelier_admin',token,{httpOnly:true,secure:req.nextUrl.protocol==='https:',sameSite:'strict',path:'/',maxAge:8*60*60});return response;
 }catch{return NextResponse.json({error:'Unable to sign in. Please try again.'},{status:400});}
}
