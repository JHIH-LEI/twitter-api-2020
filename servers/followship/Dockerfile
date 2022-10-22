FROM node:10

WORKDIR /app

COPY ./servers/followship/package.json /app

RUN npm install

# for setting sequalize
ENV NODE_ENV docker

# context is same as docker-compose.yaml

COPY ./servers/followship .

COPY ./migrations ./migrations

# for model use
COPY ./config ./config

COPY ./models ./models

# for middlewares/auth
COPY ./_helpers.js ./_helpers.js

COPY ./middlewares ./middlewares

COPY ./config ./config

COPY ./wait-for-it.sh .

# 讓wait-for-it.sh變得可執行

RUN chmod u+x wait-for-it.sh

EXPOSE 3000

#CMD ["node","index.js"]