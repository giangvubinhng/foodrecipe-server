FROM node:19-alpine
WORKDIR /app
COPY package.json yarn.lock ./

RUN yarn install --only=production

COPY . ./

EXPOSE 5000

CMD ["yarn", "start"]
