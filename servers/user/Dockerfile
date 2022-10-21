FROM node:10

# for setting sequalize
ENV NODE_ENV docker

WORKDIR /app

COPY ./servers/user/package.json .

RUN npm install

COPY ./servers/user .

COPY ./migrations ./migrations

# for model use
COPY ./config ./config

COPY ./models ./models

COPY ./tools ./tools

COPY ./middlewares ./middlewares

COPY ./_helpers.js .

COPY ./wait-for-it.sh .

EXPOSE 3000

# 讓wait-for-it.sh變得可執行

RUN chmod u+x wait-for-it.sh

#CMD ["node","index.js"]