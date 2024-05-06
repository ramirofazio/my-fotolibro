FROM node:alpine

WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma/

COPY .env ./

COPY start.sh ./

COPY . .

RUN npm install

EXPOSE 3001

CMD ["./start.sh"]
