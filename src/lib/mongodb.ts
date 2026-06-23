// MongoDB connection management with caching for serverless environments
// Prevents connection pool exhaustion in Next.js hot-reload scenarios
import mongoose from "mongoose";
import dns from "node:dns";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI no esta definido. Revisa tu archivo .env.local.");
}

// Global cache type to store persistent Mongoose connection
type CachedConnection = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Leverage globalThis to maintain connection across hot-reloads
const globalForMongoose = globalThis as typeof globalThis & {
  mongooseCache?: CachedConnection;
};

const cached = globalForMongoose.mongooseCache ?? { conn: null, promise: null };
globalForMongoose.mongooseCache = cached;

// Connect to MongoDB with connection pooling and DNS configuration
// Uses global cache to prevent duplicate connections across hot-reloads
export async function connectToDatabase() {
  // Return cached connection if already established
  if (cached.conn) {
    return cached.conn;
  }

  // Create new connection if not already in progress
  if (!cached.promise) {
    // Configure DNS servers for SRV records (Atlas) to prevent ECONNREFUSED
    if (MONGODB_URI?.startsWith("mongodb+srv://")) {
      const dnsServers = process.env.MONGODB_DNS_SERVERS ?? "1.1.1.1,8.8.8.8";
      dns.setServers(
        dnsServers
          .split(",")
          .map((server) => server.trim())
          .filter(Boolean),
      );
    }

    // Cache the promise to avoid multiple connection attempts during hot-reload
    cached.promise = mongoose.connect(MONGODB_URI!, {
      bufferCommands: false, // Fail fast if connection unavailable
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
