FROM node:10

WORKDIR /app

COPY ./servers/message/package.json .

RUN npm install

# for setting sequalize
ENV NODE_ENV docker

COPY ./servers/message .

COPY ./migrations ./migrations

COPY ./middlewares ./middlewares

# for model use
COPY ./config ./config

COPY ./models ./models

COPY ./_helpers.js .

COPY ./wait-for-it.sh .

RUN chmod u+x wait-for-it.sh

EXPOSE 3000

CMD ["node","index.js"]