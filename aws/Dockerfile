# stage 1: Development
FROM node:alpine as dev

WORKDIR /improve

ENV NODE_ENV development
RUN apk add --no-cache libc6-compat

RUN yarn global add @nestjs/cli

COPY . /improve

CMD yarn install && yarn start:dev