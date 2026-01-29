import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getCurrentUser } from './lib/mockData'
import { User } from './types'
 
// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
    const user : User | null = getCurrentUser()
    
    if(!user) return NextResponse.next();

    const userPayload = Buffer.from(JSON.stringify(user)).toString('base64');

    // 3. Cloner les headers existants et ajouter le nôtre
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-payload', userPayload);

    // 4. Retourner la réponse en injectant les nouveaux headers de requête
    return NextResponse.next({
        request: {
        headers: requestHeaders,
        },
    });
}
 
// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }
 
export const config = {
  matcher: '/:path*',
}