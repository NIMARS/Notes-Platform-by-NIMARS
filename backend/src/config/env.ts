import dotenv from "dotenv";
dotenv.config();

const rawPort = process.env.PORT ?? "3000";
const PORT = Number(rawPort);

if (Number.isNaN(PORT)) {
  throw new Error(`Invalid PORT value: ${rawPort}`);
}

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in .env");
}

export const env = {
  PORT,
  DATABASE_URL,
};
