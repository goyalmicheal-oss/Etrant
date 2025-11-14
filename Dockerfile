# ----- Base Builder Stage -----
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable

WORKDIR /app

# Copy only package.json & lock file first (better caching)
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy rest of the app
COPY . .

# Build Next.js app
RUN pnpm build



# ----- Production Runner Stage -----
FROM node:20-alpine AS runner

# Enable pnpm in runner as well
RUN corepack enable

WORKDIR /app

ENV NODE_ENV=production

# Copy only necessary output from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Expose port
EXPOSE 3000

# Start the Next.js server
CMD ["pnpm", "start"]
