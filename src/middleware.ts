import { ADMIN_AUTH_REQUIRED } from '@/lib/admin-access';
import {NextRequest,NextResponse} from 'next/server';
import {validSession} from '@/lib/admin-session';
export async function middleware(req:NextRequest){
 const path=req.nextUrl.pathname;
 if(!ADMIN_AUTH_REQUIRED&&path==='/admin/login')return NextResponse.redirect(new URL('/admin',req.url));
 if(path==='/admin/login'||path==='/api/admin/login')return NextResponse.next();
 const protectedRoute=path.startsWith('/admin')||path.startsWith('/api/admin')||path.startsWith('/api/quotations')||path.startsWith('/api/manufacturing')||/\/api\/custom-requests\/[^/]+\/revision/.test(path)||(req.method==='GET'&&['/api/leads','/api/custom-requests','/api/consultations'].includes(path));
 if(!protectedRoute)return NextResponse.next();
 if(!await validSession(req.cookies.get('atelier_admin')?.value)){if(path.startsWith('/api/'))return NextResponse.json({error:'Please sign in to the admin panel.'},{status:401});return NextResponse.redirect(new URL('/admin/login',req.url));}
 if(!['GET','HEAD'].includes(req.method)){const origin=req.headers.get('origin');if(origin&&origin!==req.nextUrl.origin)return NextResponse.json({error:'Invalid request origin.'},{status:403});}
 return NextResponse.next();
}
export const config={matcher:['/admin/:path*','/api/:path*']};
