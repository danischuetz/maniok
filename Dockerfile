# ========================================
# Optimized Multi-Stage Dockerfile
# Node.js TypeScript Application
# ========================================

ARG NODE_VERSION=lts-alpine3.23
FROM node:${NODE_VERSION} AS base

WORKDIR /app

RUN addgroup -g 1001 -S nodeuser && \
    adduser -S nodeuser -u 1001 -G nodeuser && \
    chown -R nodeuser:nodeuser /app

# ========================================
# Production Dependencies Stage
# ========================================
FROM base AS deps

COPY package*.json ./
COPY packages/maniok-core ./packages/maniok-core
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    npm ci --omit=dev && \
    npm cache clean --force
RUN chown -R nodeuser:nodeuser /app

# ========================================
# Build Dependencies Stage
# ========================================
FROM base AS build-deps
COPY package*.json ./
COPY packages/maniok-core ./packages/maniok-core
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    npm ci && \
    npm cache clean --force

# ========================================
# Build Stage
# ========================================
FROM build-deps AS build
COPY --chown=nodeuser:nodeuser . .
RUN npm run build
RUN chown -R nodeuser:nodeuser /app

# ========================================
# Packaging Stage
# ========================================
FROM node:${NODE_VERSION} AS production

WORKDIR /app

RUN addgroup -g 1001 -S nodeuser && \
    adduser -S nodeuser -u 1001 -G nodeuser && \
    chown -R nodeuser:nodeuser /app

ENV NODE_ENV=production \
    NODE_OPTIONS="--max-old-space-size=256" \
    NPM_CONFIG_LOGLEVEL=silent

COPY --from=deps --chown=nodeuser:nodeuser /app/node_modules ./node_modules
COPY --from=deps --chown=nodeuser:nodeuser /app/package*.json ./
COPY --from=build --chown=nodeuser:nodeuser /app/build ./build

CMD ["node", "build/index.js"]