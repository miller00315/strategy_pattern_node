--------------- PostGres -------------------
docker run \
 --name postgres \
 -e POSTGRES_USER=miller00315 \
 -e POSTGRES_PASSWORD=qwerty \
 -e POSTGRES_DB= heroes \
 -p 5432:5432 \
 -d \
 postgres

docker ps // Mostra o qu está sendo executado
docker exec -i postgres /bin/bash //entra no conatiner e executa o que for necessário

docker run \
 --name adminer \
 -p 8080:8080 \
 --link postgres:postgres \
 -d \
 adminer

------------------------- MongDb -----------------
docker run \
 --name mongodb \
 -p 27017:27017 \
 -e MONGO_INITDB_ROOT_USERNAME=admin \
 -e MONGO_INITDB_ROOT_PASWORD=senhaadmin \
 -d \
 mongo:4

docker run \
 --name mongoclient \
 -p 3000:3000 \
 --link mongodb:mongodb \
 -d \
 mongoclient/mongoclient

---

docker exec -it mongodb \
 mongo --host localhost -u admin -p senhaadmin --authenticationDatabase admin \
 --eval "db.getSiblingDB('herois').createUser({user: 'miller', pwd: 'minhasenhasecreta', roles: [{role: 'readWrite', db: 'herois'}]})"
