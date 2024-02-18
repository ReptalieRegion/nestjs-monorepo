# 🛠 Build the builder image
FROM node:18-alpine as builder
RUN npm install -g npm@latest

WORKDIR /builder

# yarn berry
RUN corepack enable
RUN yarn set version stable

# Copy config files and source
COPY /apps/crawl-nest ./apps/crawl-nest/
COPY /private-packages ./private-packages
COPY tsconfig.base.json .
COPY nest-cli.json .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY yarn.lock .
COPY package.json .

# Install dependencies and build
RUN cd ./apps/crawl-nest && yarn install || (cat /tmp/*/build.log; exit 1)

# build
RUN yarn build:server

# # 🚀 Build the runner image
FROM node:18-alpine as runner
RUN npm install -g npm@latest

WORKDIR /runner

# yarn berry
RUN corepack enable
RUN yarn set version stable

# # Copy files in logical layer order
COPY --from=builder /builder/.yarn .yarn
COPY --from=builder /builder/.pnp.cjs .
COPY --from=builder /builder/.pnp.loader.mjs .
COPY --from=builder /builder/yarn.lock .
COPY --from=builder /builder/package.json .
COPY --from=builder /builder/apps/crawl-nest/dist /runner/apps/crawl-nest/dist
COPY --from=builder /builder/apps/crawl-nest/package.json /runner/apps/crawl-nest/

# # ⚙️ Configure the default command
CMD yarn start:prod