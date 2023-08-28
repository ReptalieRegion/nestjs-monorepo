# 🛠 Build the builder image
FROM node:18-alpine as builder
RUN npm install -g npm@latest

WORKDIR /builder

# yarn berry
RUN corepack enable
RUN yarn set version stable

# Copy config files and source
COPY /apps/reptalie-region-nest ./apps/reptile-region-nest/
COPY /configs ./configs
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY yarn.lock .
COPY package.json .

# Install dependencies and build
RUN cd ./apps/reptile-region-nest && yarn install || (cat /tmp/*/build.log; exit 1)

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
COPY --from=builder /builder/apps/reptile-region-nest/dist /runner/apps/reptile-region-nest/dist
COPY --from=builder /builder/apps/reptile-region-nest/package.json /runner/apps/reptile-region-nest/

# # ⚙️ Configure the default command
WORKDIR /runner/apps/reptile-region-nest
CMD yarn start:prod