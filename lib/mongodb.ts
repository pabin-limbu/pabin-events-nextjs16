import mongoose, { Connection, Mongoose } from 'mongoose';

/**
 * The MongoDB connection string.
 *
 * This **must** be defined in your environment variables (e.g. `.env.local`)
 * as `MONGODB_URI`. We throw early in case it is missing so that misconfiguration
 * is obvious during development and in production.
 */
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside your environment (.env.local)'
  );
}

/**
 * Shape of the cached connection object stored on the global object.
 *
 * - `conn` will hold the active Mongoose instance once connected.
 * - `promise` will hold the in-flight connection promise while a connection
 *    is being established. This prevents multiple parallel connection attempts
 *    in development when Next.js hot-reloads modules.
 */
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

/**
 * Augment the global scope to include our cached Mongoose connection.
 *
 * On the server, Next.js can reload modules during development which would
 * normally create a new connection on every reload. By attaching the cache
 * to `global`, the same connection instance is reused across reloads.
 */
declare global {
  // `var` is required here because we are mutating the global object.
  // eslint-disable-next-line no-var
  var _mongoose: MongooseCache | undefined;
}

const globalForMongoose = global as typeof globalThis & {
  _mongoose?: MongooseCache;
};

// Initialize the cache if it does not exist yet.
const cached: MongooseCache = globalForMongoose._mongoose ?? {
  conn: null,
  promise: null,
};

if (!globalForMongoose._mongoose) {
  globalForMongoose._mongoose = cached;
}

/**
 * Get a cached Mongoose connection.
 *
 * This function should be used wherever a database connection is required
 * (e.g. in route handlers, server actions, or API routes).
 *
 * It ensures:
 *  - Only one connection is created per server instance.
 *  - The same connection is reused across hot reloads in development.
 */
export async function connectToDatabase(): Promise<Mongoose> {
  // If we already have an established connection, return it immediately.
  if (cached.conn) {
    return cached.conn;
  }

  // If there is no ongoing connection attempt, start one and cache the promise.
  if (!cached.promise) {
    const opts: Parameters<typeof mongoose.connect>[1] = {
      // Add any connection options you need here.
      // For example: dbName: 'my-db-name', bufferCommands: false, etc.
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset promise so future calls can retry connecting in case of failure.
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

/**
 * Convenience export for the underlying Mongoose `Connection` object.
 *
 * You can import this in places where you specifically need the low-level
 * connection (e.g. for accessing `db` or running raw commands). The value
 * will be `null` until `connectToDatabase()` has been awaited at least once
 * in the current process.
 */
export const mongooseConnection: Connection | null = mongoose.connection ?? null;
