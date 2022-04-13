ARG NODE_VERSION
ARG SOURCE_FOLDER

FROM node:$NODE_VERSION as builder

WORKDIR /unleash

COPY platforms/$SOURCE_FOLDER/* ./

RUN yarn install --frozen-lockfile --production=true

FROM node:$NODE_VERSION

ENV NODE_ENV production

WORKDIR /unleash

COPY --from=builder /unleash /unleash

RUN rm -rf /usr/local/lib/node_modules/npm/

EXPOSE 4242

USER node

CMD node index.js
