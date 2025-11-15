import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// if uri not found throw err imm
if (!MONGODB_URI) throw new Error('Please define MONGODB_URI in .env.local');

// global var to cache conn to prev mult conn being opened every reload
let cached = global.mongoose || (global.mongoose = { conn: null, promise: null });

// single conn to reuse
async function dbConnect() {
  // ret if exists
  if (cached.conn) return cached.conn;

  // wait to conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false })
      .then((mongoose) => {
        console.log("MongoDB connected");
        return mongoose;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
