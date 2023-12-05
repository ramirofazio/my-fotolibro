sleep 5

docker compose -p my-fotolibro up postgres -d --build

sleep 5

npm run dev