# 1. 빌드 단계
FROM node:20-bullseye-slim AS builder

## 작업 디렉토리 설정
WORKDIR /app

## 의존성 설치
COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig.json ./
COPY api/package.json ./api/

RUN npm ci --include-workspace-root --include=dev

## 애플리케이션 빌드
COPY api/ ./api/

RUN npm run build --workspace api

## 개발용 의존성 제거
RUN npm prune --omit=dev --workspace api

# 2. 실행 단계
FROM node:20-bullseye AS runner

## 작업 디렉토리 설정
WORKDIR /app

## 프로세스 권한 다운
USER node

## 빌드된 애플리케이션 복사
COPY --from=builder /app/dist/reminder/api/ ./dist
COPY --from=builder /app/node_modules ./node_modules

## 포트 설정
EXPOSE ${PORT}
EXPOSE ${MS_PORT}

## 애플리케이션 실행
CMD ["node", "dist/main.js"]