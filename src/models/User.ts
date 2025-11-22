// models/User.ts
import mongoose, { Schema, Model, models } from 'mongoose'
import { IUser } from '@/types'

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'El nombre es requerido'],
    },
    email: {
      type: String,
      required: [true, 'El email es requerido'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email inválido'],
    },
    image: {
      type: String,
    },
    emailVerified: {
      type: Date,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'premium'],
      default: 'user',
    },
    provider: {
      type: String,
      enum: ['google', 'credentials'],
      required: true,
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    lastLogin: {
      type: Date,
    },
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light',
      },
      language: {
        type: String,
        default: 'es',
      },
      notifications: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
)

// Índices
userSchema.index({ email: 1 })
userSchema.index({ googleId: 1 }, { sparse: true })

// Métodos de instancia
userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.__v
  return obj
}

// Crear o obtener el modelo
const User: Model<IUser> = models.User || mongoose.model<IUser>('User', userSchema)

export default User