import dotenv from "dotenv";

dotenv.config();

const rawPort = process.env.PORT ?? "3000";
const PORT = Number(rawPort);

if (Number.isNaN(PORT)) {
  throw new Error(`Invalid PORT value: ${rawPort}`);
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in environment");
}

export const env = {
  PORT,
  JWT_SECRET,
};
