FROM node:8.11.3-alpine

RUN mkdir -p /src/app

WORKDIR /src/app

COPY . /src/app

RUN yarn install

EXPOSE 3003

RUN npm run prod

CMD [ "npm", "start" ]