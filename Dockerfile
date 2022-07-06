FROM node:16

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn

COPY . .

RUN npx prisma generate

RUN yarn build


EXPOSE 8080

CMD [ "yarn", "start:prod" ]
