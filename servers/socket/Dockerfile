FROM node:10

WORKDIR /app

COPY ./servers/socket/package.json .

RUN npm install

# for setting sequalize
ENV NODE_ENV docker

COPY ./servers/socket .

COPY ./migrations ./migrations

# for model use
COPY ./config ./config

COPY ./models ./models

COPY ./wait-for-it.sh .

# 讓wait-for-it.sh變得可執行

RUN chmod u+x wait-for-it.sh

EXPOSE 3000

#CMD ["node","index.js"]