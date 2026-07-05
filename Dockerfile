# ==========================
# Base Stage
# ==========================
FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Development Stage
FROM base AS development

ENV NODE_ENV=development

EXPOSE 3000

CMD ["npm", "run", "dev"]

# Production Dependencies
FROM node:22-alpine AS production-deps

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force


# Production Stage
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY --from=production-deps /app/node_modules ./node_modules
COPY . .

# Create non-root user
RUN addgroup -S nodejs && \
    adduser -S appuser -G nodejs

RUN chown -R appuser:nodejs /app

USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
CMD node -e "require('http').get('http://localhost:3000/health', (res)=>process.exit(res.statusCode===200?0:1)).on('error',()=>process.exit(1))"

CMD ["npm", "start"]