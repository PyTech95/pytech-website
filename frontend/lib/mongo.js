import { MongoClient } from 'mongodb';

let connection;

export async function getDb() {
  if (!process.env.MONGO_URL || !process.env.DB_NAME) throw new Error('Mongo configuration is missing');
  if (!connection) connection = new MongoClient(process.env.MONGO_URL).connect().catch((error) => { connection = null; throw error; });
  return (await connection).db(process.env.DB_NAME);
}
