import "./config/env";

import app from "./app";
import { connectDB } from "./config/db";

const PORT = Number(process.env["PORT"]) || 5000;

async function startServer(): Promise<void> {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`BharatFix AI API is running on port ${PORT}`);
  });
}

void startServer();
