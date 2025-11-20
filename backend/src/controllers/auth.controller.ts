import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import type { RegisterInput, LoginInput } from "../schemas/auth.schema.js";

function createToken(payload: { userId: number; email: string }) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
}

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as RegisterInput;

      const existing = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existing) {
        return res.status(409).json({ message: "User already exists" });
      }

      const passwordHash = await bcrypt.hash(data.password, 10);

      const user = await prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          passwordHash,
        },
      });

      const token = createToken({ userId: user.id, email: user.email });

      res.status(201).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as LoginInput;

      const user = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const ok = await bcrypt.compare(data.password, user.passwordHash);
      if (!ok) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = createToken({ userId: user.id, email: user.email });

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const userPayload = (req as any).user as { userId: number; email: string };

      const user = await prisma.user.findUnique({
        where: { id: userPayload.userId },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (err) {
      next(err);
    }
  },
};
