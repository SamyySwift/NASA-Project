FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./
COPY frontend/package.json frontend/
RUN npm install-client --omit=dev

COPY backend/package*.json backend/
RUN npm install-server --omit=dev

COPY frontend/ frontend/
RUN npm run build --prefix frontend

COPY backend/ backend/

EXPOSE 8000

USER node

CMD ["npm", "start", "--prefix", "backend"]