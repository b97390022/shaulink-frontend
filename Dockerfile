FROM node:18.17.0-bullseye as build

WORKDIR /home/node/app

COPY package.json /home/node/app/
COPY package-lock.json /home/node/app/

RUN npm ci

COPY config /home/node/app/config
COPY public /home/node/app/public
COPY scripts /home/node/app/scripts
COPY src /home/node/app/src
COPY .env.production /home/node/app/

RUN npm run build

FROM nginx:1.22.1-alpine as deploy

RUN rm /etc/nginx/conf.d/default.conf

COPY *.conf /etc/nginx/conf.d/
COPY --from=build /home/node/app/build /usr/share/nginx/html
