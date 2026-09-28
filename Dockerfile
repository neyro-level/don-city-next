# syntax=docker/dockerfile:1.7

FROM node:24.20.0-bookworm-slim AS build

ENV CI=true \
	NEXT_TELEMETRY_DISABLED=1 \
	npm_config_fetch_retries=5 \
	npm_config_fetch_retry_maxtimeout=120000 \
	npm_config_fetch_timeout=300000
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.5.1 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
RUN --mount=type=cache,id=don-city-pnpm-store,target=/pnpm/store \
	pnpm install --frozen-lockfile --shamefully-hoist --store-dir=/pnpm/store

COPY . .
RUN ./node_modules/.bin/next build --webpack

FROM build AS migration-package

RUN pnpm --filter don-city-next deploy --prod --legacy /migration \
	&& rm -rf /migration/.next /migration/public /migration/docs /migration/deploy

FROM node:24.20.0-bookworm-slim AS migration

ENV NODE_ENV=production \
	COREPACK_HOME=/tmp/corepack \
	HOME=/tmp \
	NEXT_TELEMETRY_DISABLED=1 \
	JOBS_AUTORUN=false

WORKDIR /app

RUN groupadd --system --gid 1001 nodejs \
	&& useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=migration-package --chown=nextjs:nodejs /migration ./

USER nextjs

CMD ["node", "--conditions=react-server", "./node_modules/payload/bin.js", "migrate"]

FROM node:24.20.0-bookworm-slim AS runtime

ENV NODE_ENV=production \
	COREPACK_HOME=/tmp/corepack \
	HOME=/tmp \
	NEXT_TELEMETRY_DISABLED=1 \
	HOSTNAME=0.0.0.0 \
	PORT=3000

WORKDIR /app

RUN groupadd --system --gid 1001 nodejs \
	&& useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
