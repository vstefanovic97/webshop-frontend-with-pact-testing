FROM node:20-alpine

WORKDIR /build

COPY . .

RUN npm ci && npm run build

CMD npm run start