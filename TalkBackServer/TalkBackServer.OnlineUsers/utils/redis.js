import { createClient } from "redis";

const client = await createClient(6379, "127.0.0.1")
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

export default client;
