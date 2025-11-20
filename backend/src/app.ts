import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { logger } from "./middlewares/logger.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import noteRoutes from "./routes/note.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { swaggerSpec } from "./docs/swagger.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

export default app;
