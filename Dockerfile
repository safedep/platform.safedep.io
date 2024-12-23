FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# https://docs.docker.com/build/building/secrets/
RUN --mount=type=secret,id=sentry_auth_token,env=SENTRY_AUTH_TOKEN \
	npm run build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npx", "next", "start", "-p", "3000", "-H", "0.0.0.0"]
