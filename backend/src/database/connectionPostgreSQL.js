import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new pg.Pool({
  host: process.env.DATABASEHOST,
  port: process.env.DATABASEPORT,
  database: process.env.DATABASENAME,
  user: process.env.DATABASEUSER,
  password: process.env.DATABASEPASSWORD,
});
