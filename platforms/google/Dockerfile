ARG NODE_VERSION=20.19.2-alpine

FROM node:$NODE_VERSION AS builder

WORKDIR /unleash

COPY google-auth-hook.js index.js package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production=true

FROM node:$NODE_VERSION AS runner

ENV NODE_ENV=production

WORKDIR /unleash

COPY --from=builder /unleash /unleash

RUN rm -rf /usr/local/lib/node_modules/npm/

EXPOSE 4242

USER node

CMD ["node", "index.js"]
