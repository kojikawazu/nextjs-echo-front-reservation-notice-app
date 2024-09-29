# ビルドステージ
FROM node:18-alpine as builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# 実行ステージ
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app /app
EXPOSE 3000
CMD ["npm", "run", "start"]
