import express from "express";
import compression from "express-compression";
import dotenv from "dotenv";
import articulesRouter from "./routers/articules.router.js";

dotenv.config();

export const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(
  compression({
    brotli: { enabled: true, zlib: {} },
  })
);

app.use("/api/articules", articulesRouter);
export default app;

if (process.env.NODE_ENV !== "test") {
  try {
    app.listen(PORT, () => console.log(`SERVER UP, listen on port ${PORT}`));
  } catch (error) {
    console.error(error);
  }
}
