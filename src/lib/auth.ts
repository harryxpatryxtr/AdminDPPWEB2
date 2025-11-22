// lib/auth.ts
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Session } from "next-auth"
import connectDB from "./mongodb"
import User from "@/models/User"
import { IUser } from "@/types"

export async function getSession(): Promise<Session | null> {
  return await getServerSession(authOptions)
}

export async function getCurrentUser(): Promise<Session["user"] | null> {
  const session = await getSession()
  return session?.user || null
}

export async function getCurrentUserFromDB(): Promise<IUser | null> {
  const session = await getSession()
  
  if (!session?.user?.email) {
    return null
  }

  await connectDB()
  const user = await User.findOne({ email: session.user.email }).lean()
  
  if (!user) {
    return null
  }

  return {
    ...user,
    _id: user._id.toString(),
  } as IUser
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return !!session
}

export async function hasRole(role: string): Promise<boolean> {
  const session = await getSession()
  return session?.user?.role === role
}

export async function isAdmin(): Promise<boolean> {
  return hasRole('admin')
}