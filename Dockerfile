FROM node:18.17.0-bullseye as build

WORKDIR /home/node/app

COPY package.json /home/node/app/
COPY package-lock.json /home/node/app/

RUN npm ci

COPY public /home/node/app/public
COPY src /home/node/app/src

RUN npm run build

FROM nginx:1.22.1-alpine as deploy

RUN rm /etc/nginx/conf.d/default.conf

COPY *.conf /etc/nginx/conf.d/
COPY --from=build /home/node/app/build /usr/share/nginx/html
