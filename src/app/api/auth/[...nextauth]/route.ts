// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions, Session, User as NextAuthUser } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { JWT } from "next-auth/jwt"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import { IUser } from "@/types"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },

  pages: {
    signIn: "/login",
    error: "/error",
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          await connectDB()

          // Verificar si el usuario ya existe
          let existingUser = await User.findOne({ email: user.email })

          if (!existingUser) {
            // Crear nuevo usuario
            existingUser = await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              emailVerified: new Date(),
              provider: "google",
              googleId: profile?.sub,
              role: "user",
              lastLogin: new Date(),
              preferences: {
                theme: "light",
                language: "es",
                notifications: true,
              },
            })

            console.log("✅ Nuevo usuario creado:", existingUser.email)
          } else {
            // Actualizar último login
            existingUser.lastLogin = new Date()
            await existingUser.save()
            
            console.log("👤 Usuario existente:", existingUser.email)
          }

          return true
        } catch (error) {
          console.error("❌ Error en signIn callback:", error)
          return false
        }
      }

      return true
    },

    async jwt({ token, user, account, trigger, session }: {
      token: JWT
      user?: NextAuthUser
      account?: any
      trigger?: "signIn" | "signUp" | "update"
      session?: any
    }) {
      // Primer login
      if (user && account) {
        try {
          await connectDB()
          const dbUser = await User.findOne({ email: user.email })

          if (dbUser) {
            token.id = dbUser._id.toString()
            token.role = dbUser.role
            token.provider = dbUser.provider
          }
        } catch (error) {
          console.error("❌ Error en jwt callback:", error)
        }
      }

      // Actualizar sesión
      if (trigger === "update" && session) {
        token = { ...token, ...session.user }
      }

      return token
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.provider = token.provider
      }

      return session
    },
  },

  events: {
    async signIn({ user, isNewUser }) {
      if (isNewUser) {
        console.log("🎉 Nuevo usuario registrado:", user.email)
        // Aquí puedes enviar email de bienvenida, etc.
      }
    },
    
    async signOut({ token }) {
      console.log("👋 Usuario cerró sesión:", token.email)
    },
  },

  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }