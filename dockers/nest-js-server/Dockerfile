# 🛠 Build the builder image
FROM node:18-alpine as builder
WORKDIR /builder

# yarn berry
RUN npm install -g corepack && corepack enable
RUN yarn set version stable

# Copy config files and source
COPY /apps/crawl-nest ./apps/crawl-nest/
COPY /private-packages ./private-packages
COPY tsconfig.base.json nest-cli.json .yarnrc.yml yarn.lock package.json ./
COPY .yarn .yarn

# Install dependencies and build
RUN yarn install --frozen-lockfile || (cat /tmp/*/build.log; exit 1)

# build
RUN yarn build:server

# # 🚀 Build the runner image
FROM node:18-alpine as runner
WORKDIR /runner

# yarn berry
RUN npm install -g corepack && corepack enable
RUN yarn set version stable

# Copy files in logical layer order
COPY --from=builder /builder/.yarn .yarn
COPY --from=builder /builder/.pnp.cjs .
COPY --from=builder /builder/.pnp.loader.mjs .
COPY --from=builder /builder/yarn.lock .
COPY --from=builder /builder/package.json .
COPY --from=builder /builder/apps/crawl-nest/dist /runner/apps/crawl-nest/dist
COPY --from=builder /builder/apps/crawl-nest/package.json /runner/apps/crawl-nest/

# Configure the default command
CMD yarn start:prod