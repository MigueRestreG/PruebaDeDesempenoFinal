import mongoose from "mongoose";
import dns from "node:dns";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI no esta definido. Revisa tu archivo .env.local.");
}

type CachedConnection = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as typeof globalThis & {
  mongooseCache?: CachedConnection;
};

const cached = globalForMongoose.mongooseCache ?? { conn: null, promise: null };
globalForMongoose.mongooseCache = cached;

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    if (MONGODB_URI?.startsWith("mongodb+srv://")) {
      const dnsServers = process.env.MONGODB_DNS_SERVERS ?? "1.1.1.1,8.8.8.8";
      dns.setServers(
        dnsServers
          .split(",")
          .map((server) => server.trim())
          .filter(Boolean),
      );
    }

    // En desarrollo Next recompila modulos con frecuencia; cachear evita conexiones duplicadas.
    cached.promise = mongoose.connect(MONGODB_URI!, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
