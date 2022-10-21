FROM node:10

ENV NODE_ENV docker

WORKDIR /app

COPY ./servers/admin/package.json .

RUN npm install

COPY ./servers/admin .

COPY ./migrations ./migrations

# for model use
COPY ./config ./config

COPY ./models ./models

COPY ./wait-for-it.sh .

# 讓wait-for-it.sh變得可執行

RUN chmod u+x wait-for-it.sh

EXPOSE 3000

#CMD ["node","index.js"]