FROM node:alpine as vite

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .
RUN npm run build


FROM nginx:alpine

COPY --from=vite /app/dist /usr/share/nginx/html

EXPOSE 5173

COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
