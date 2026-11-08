import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB || "digital";

if (!uri) {
  throw new Error("Set MONGODB_URI to connect Digital to MongoDB.");
}

declare global {
  // Reuse the connection during Next.js development hot reloads.
  // eslint-disable-next-line no-var
  var digitalMongoClientPromise: Promise<MongoClient> | undefined;
}

const client = new MongoClient(uri);
const clientPromise = global.digitalMongoClientPromise ?? client.connect();

if (process.env.NODE_ENV !== "production") {
  global.digitalMongoClientPromise = clientPromise;
}

export async function getMongoDatabase() {
  const connectedClient = await clientPromise;
  return connectedClient.db(databaseName);
}
