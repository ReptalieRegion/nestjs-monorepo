# 🛠 Build the builder image
FROM node:18-alpine as builder
WORKDIR /builder

ARG JWT_ACCESS_TOKEN_TIME
ARG JWT_REFRESH_TOKEN_TIME
ARG MODE
ARG AWS_IMAGE_BASEURL
ARG SLACK_TOKEN
ARG MONGODB_URI
ARG JWT_SECRET_KEY
ARG INTERATIONS
ARG DKLEN
ARG HASH

RUN echo "::${MODE}::"

# yarn berry
RUN npm install -g npm@latest && corepack enable
RUN yarn set version stable

# Copy config files and source
COPY /apps/crawl-admin ./apps/crawl-admin/
COPY /private-packages ./private-packages
COPY tsconfig.base.json nest-cli.json .yarnrc.yml yarn.lock package.json ./
COPY .yarn .yarn

# Install dependencies and build
RUN yarn install || (cat /tmp/*/build.log; exit 1)

# build
RUN yarn build:all
RUN yarn build:admin

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
COPY --from=builder /builder/apps/crawl-admin/dist ./apps/crawl-admin/dist
COPY --from=builder /builder/apps/crawl-admin/package.json ./apps/crawl-admin/

COPY --from=builder /builder/private-packages/@crawl/models/dist ./private-packages/@crawl/models/dist
COPY --from=builder /builder/private-packages/@crawl/models/package.json ./private-packages/@crawl/models/

COPY --from=builder /builder/private-packages/@crawl/types/dist ./private-packages/@crawl/types/dist
COPY --from=builder /builder/private-packages/@crawl/types/package.json ./private-packages/@crawl/types/

COPY --from=builder /builder/private-packages/slack/dist ./private-packages/slack/dist
COPY --from=builder /builder/private-packages/slack/package.json ./private-packages/slack/

COPY --from=builder /builder/private-packages/utils/dist ./private-packages/utils/dist
COPY --from=builder /builder/private-packages/utils/package.json ./private-packages/utils/

RUN yarn install

# Configure the default command
CMD yarn prod:admin