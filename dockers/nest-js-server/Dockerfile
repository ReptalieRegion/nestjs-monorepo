# 🛠 Build the builder image
FROM node:18-alpine as builder
WORKDIR /builder

# yarn berry
RUN npm install -g npm@latest && corepack enable
RUN yarn set version stable

# Copy config files and source
COPY /apps/crawl-nest ./apps/crawl-nest/
COPY /private-packages ./private-packages
COPY tsconfig.base.json nest-cli.json .yarnrc.yml yarn.lock package.json ./
COPY .yarn .yarn

# Install dependencies and build
RUN yarn install || (cat /tmp/*/build.log; exit 1)

# build
RUN yarn build:all
RUN yarn build:server

# # 🚀 Build the runner image
FROM node:18-alpine as runner

WORKDIR /runner
# Copy files in logical layer order
COPY --from=builder /builder/.yarn ./.yarn
COPY --from=builder /builder/.pnp.cjs .
COPY --from=builder /builder/.pnp.loader.mjs .
COPY --from=builder /builder/yarn.lock .
COPY --from=builder /builder/package.json .
COPY --from=builder /builder/.yarnrc.yml .
COPY --from=builder /builder/nest-cli.json .
COPY --from=builder /builder/apps/crawl-nest/dist ./apps/crawl-nest/dist
COPY --from=builder /builder/apps/crawl-nest/package.json ./apps/crawl-nest/

COPY --from=builder /builder/private-packages/@crawl/models/dist ./private-packages/@crawl/models/dist
COPY --from=builder /builder/private-packages/@crawl/models/package.json ./private-packages/@crawl/models/

COPY --from=builder /builder/private-packages/@crawl/types/dist ./private-packages/@crawl/types/dist
COPY --from=builder /builder/private-packages/@crawl/types/package.json ./private-packages/@crawl/types/

COPY --from=builder /builder/private-packages/utils/dist ./private-packages/utils/dist
COPY --from=builder /builder/private-packages/utils/package.json ./private-packages/utils/

RUN yarn install

# Configure the default command
CMD yarn prod:server