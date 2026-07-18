import mongoose from 'mongoose'

// Vercel serverless functions re-use warm container connections.
// We cache the Mongoose connection in a module-level variable so
// subsequent invocations skip the TCP handshake to Atlas.

let cached: mongoose.Connection | null = null

export async function connectDB(): Promise<mongoose.Connection> {
  if (cached && cached.readyState === 1) {
    return cached
  }

  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('[db] MONGODB_URI is not set in environment variables')
  }

  await mongoose.connect(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })

  cached = mongoose.connection
  console.log('[db] MongoDB Atlas connected:', cached.host)
  return cached
}
