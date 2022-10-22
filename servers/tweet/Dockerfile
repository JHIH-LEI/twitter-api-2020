FROM node:10

WORKDIR /app

COPY ./servers/tweet/package.json .

RUN npm install

# for setting sequalize
ENV NODE_ENV docker

COPY ./servers/tweet .

COPY ./migrations ./migrations

# for model use
COPY ./config ./config

COPY ./models ./models

COPY ./tools ./tools

COPY ./wait-for-it.sh .

COPY ./middlewares ./middlewares

COPY ./_helpers.js .

# 讓wait-for-it.sh變得可執行

RUN chmod u+x wait-for-it.sh

EXPOSE 3000

#CMD ["node","index.js"]