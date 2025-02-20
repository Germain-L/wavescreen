# Build stage
FROM node:22-slim AS build-stage
WORKDIR /app

# Global pnpm installation and dependency installation for build
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy the entire source and run the build command
COPY . .
RUN pnpm run build

# Runner stage
FROM node:22-slim AS runner
WORKDIR /app

# Install Puppeteer/Chromium dependencies (libgbm1 provides the missing libgbm.so.1)
RUN apt-get update && apt-get install -y \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libgdk-pixbuf2.0-0 \
  libglib2.0-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libgbm1 \
  xdg-utils \
  --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Copy build artifacts from the build stage
COPY --from=build-stage /app/build ./build
COPY --from=build-stage /app/package.json ./
COPY --from=build-stage /app/pnpm-lock.yaml ./

# Install production dependencies
RUN npm install -g pnpm
RUN pnpm install --prod --frozen-lockfile

EXPOSE 3000

CMD ["node", "build"]