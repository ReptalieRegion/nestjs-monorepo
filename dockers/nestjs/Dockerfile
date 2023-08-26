# 🛠 Build the builder image
FROM node:18 as builder
WORKDIR /builder

# yarn berry
RUN corepack enable
RUN yarn set version stable

# Copy config files and source
COPY /configs ./configs
COPY .yarn ./apps/reptile-region-nest/.yarn
COPY /apps/reptalie-region-nest ./apps/reptile-region-nest/
COPY .yarnrc.yml ./apps/reptile-region-nest/
COPY yarn.lock ./apps/reptile-region-nest/
COPY configs .

# Install dependencies and build
RUN cd ./apps/reptile-region-nest && yarn install || (cat /tmp/*/build.log; exit 1)
RUN cd ./apps/reptile-region-nest && yarn build

# Using Yarn plugin-production-install to copy only production dependencies
# https://gitlab.com/Larry1123/yarn-contrib/-/tree/master/packages/plugin-production-install
RUN cd ./apps/reptile-region-nest && yarn prod-install /deploy/dependencies

# Copy other needed files
RUN cp -r ./apps/reptile-region-nest/.env /deploy/.env
RUN cp -r ./apps/reptile-region-nest/dist /deploy/dist

# 🚀 Build the runner image
FROM node:18 as runner
WORKDIR /runner

# Copy files in logical layer order
COPY --from=builder /deploy/dependencies .
COPY --from=builder /deploy/.env .env
COPY --from=builder /deploy/dist ./dist

# ⚙️ Configure the default command
CMD yarn start:prod