FROM node:12.18-alpine as debug

WORKDIR /usr/src/app
RUN apk add --update git
COPY package.json .
RUN npm install --no-cache
RUN npm install -g nodemon
COPY . .
ENV NODE_ENV=debug
EXPOSE 3000
ENTRYPOINT [ "nodemon", "-r", "esm", "--inspect=0.0.0.0", "server.js" ]