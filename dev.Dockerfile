FROM node:19-alpine
WORKDIR /app
COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . ./

EXPOSE 5000

CMD ["yarn", "dev"]
