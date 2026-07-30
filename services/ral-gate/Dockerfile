# ral-gate — OTP email unlock API
#
# Runs the TypeScript sources directly through tsx (same as `npm start`), so the
# image needs devDependencies. better-sqlite3 is a native module: it is compiled
# in the build stage and the runtime stage uses the same base image so the
# prebuilt binary stays ABI-compatible.

FROM node:22-bookworm-slim AS build
WORKDIR /app
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY . .

# SQLite lives on a mounted volume at /data (DATABASE_PATH), not in /app/data —
# /app/data is shipped in the image and holds the disposable-domain list.
RUN mkdir -p /data && chown -R node:node /data /app

USER node
EXPOSE 8787
CMD ["node", "--import", "tsx", "src/index.ts"]
