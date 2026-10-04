import cors from "cors";
import express from "express";
import { UPLOADS_DIR } from "./middleware/upload";
import { errorHandler, notFound } from "./middleware/errorHandler";
import routes from "./routes";

const allowedOrigins = (process.env["CLIENT_URL"] ?? "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

const app = express();

app.use(cors(allowedOrigins.length > 0 ? { origin: allowedOrigins } : undefined));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(UPLOADS_DIR));

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
