# Projet_Stack_S2

## client

```
cd client
pnpm install 
pnpm run dev
```

## server
```
cd server
vs code: REST Client pour le fichier .http
npm i 
npm run dev

mettre un .env avec le contenue suivant 

DB_URL=mongodb+srv://SebYlc:LGECex3QjT1E1THI@challengegeoguessr.ntvjye0.mongodb.net/challenge?retryWrites=true&w=majority
JWT_SECRET=5f4dcc3b5aa765d61d8327deb882cf99
PORT=3000

```
## Docker
```

docker exec projet_stack_s2-server-1  npm run dev

Si modif sur la bdd 
docker compose exec server node migrate.js
```

## Stripe
```
Cartes test :
     success : 4242424242424242
     fail : 4000000000000002
     authentication_required : 4000000000003220

```