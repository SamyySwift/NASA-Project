FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./
COPY frontend/package*.json frontend/

RUN npm run install-client --omit=dev

COPY backend/package*.json backend/
RUN npm run install-server --omit=dev

COPY frontend/ frontend/
COPY backend/ backend/

RUN npm run build --prefix frontend

USER node

EXPOSE 8000

CMD ["npm", "start", "server", "--prefix", "backend"]