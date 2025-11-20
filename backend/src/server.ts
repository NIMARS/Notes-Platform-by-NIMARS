import app from "./app.js";
import { env } from "./config/env.js";

try {
  const { PORT } = env;

  app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
    console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
  });
} catch (err) {
  console.error("Fatal error during server startup:", err);
  process.exit(1);
}

