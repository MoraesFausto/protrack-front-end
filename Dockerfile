FROM node:19-alpine

WORKDIR /app

# instalar dependências
COPY package*.json ./
RUN npm ci

# copiar o restante e expor porta 4200
COPY . .
EXPOSE 4200

# rodar em dev para poder live‑reload
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0"]

