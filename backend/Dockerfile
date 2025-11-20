# backend/Dockerfile

FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig*.json ./
COPY prisma ./prisma
COPY src ./src

RUN npm run build

RUN npx prisma generate

FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/prisma ./prisma
COPY package*.json ./

EXPOSE 3000

CMD npx prisma migrate deploy && node dist/server.js