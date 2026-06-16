FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS install
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM base AS dev
COPY --from=install /app/node_modules ./node_modules
COPY . .
EXPOSE 5173
CMD ["bun", "run", "dev", "--host", "0.0.0.0"]
