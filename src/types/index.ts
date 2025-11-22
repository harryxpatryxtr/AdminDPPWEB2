// types/index.ts
import { DefaultSession } from "next-auth"

export interface IUser {
  _id: string
  name: string
  email: string
  image?: string
  emailVerified?: Date
  role: 'user' | 'admin' | 'premium'
  provider: 'google' | 'credentials'
  googleId?: string
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
  preferences?: {
    theme: 'light' | 'dark'
    language: string
    notifications: boolean
  }
}

// Extender tipos de NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      provider: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: string
    provider: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    provider: string
  }
}