FROM node:18-alpine AS builder
WORKDIR /src
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
ENV NODE_OPTIONS="--max-old-space-size=1536"
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /src
ENV NODE_ENV=production
COPY --from=builder /src/.next/standalone ./
COPY --from=builder /src/.next/static ./.next/static
COPY --from=builder /src/public ./public
COPY --from=builder /src/prisma ./prisma
COPY --from=builder /src/node_modules/.prisma ./node_modules/.prisma
EXPOSE 3000
CMD ["node", "server.js"]
