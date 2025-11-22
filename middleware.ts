// middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Redirigir usuarios autenticados del login al dashboard
    if (pathname.startsWith('/login') && token) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Proteger rutas de admin
    if (pathname.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Rutas públicas
        if (pathname === '/' || pathname.startsWith('/login')) {
          return true
        }

        // Otras rutas requieren autenticación
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}