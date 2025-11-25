// middleware.ts
import { NextRequest, NextResponse } from "next/server"
import { isAuthenticatedRequest, getUserFromToken } from "@/lib/authMiddleware"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuthenticated = isAuthenticatedRequest(request)
  const user = getUserFromToken(request)

  // Rutas públicas - permitir acceso sin autenticación
  const publicRoutes = ['/', '/login']
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/login')

  // Si está en una ruta pública y está autenticado, redirigir al dashboard
  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/user', request.url))
  }

  // Si no está en una ruta pública y no está autenticado, redirigir al login
  if (!isPublicRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Proteger rutas de admin
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    // Verificar rol de admin desde el token
    if (user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/user', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}