import mongoose from "mongoose";

const { MONGODB_URI = "" } = process.env;

if (!MONGODB_URI) {
  console.warn("MONGODB_URI is not set. Database operations will fail.");  
}

let connection: Promise<typeof mongoose> | null = null;

export const dbConnect = () => {
  if (connection) return connection;
  connection = mongoose
    .connect(MONGODB_URI, {
      bufferCommands: false
    })
    .catch((err) => {
      connection = null;
      throw err;
    });
  return connection;
};
