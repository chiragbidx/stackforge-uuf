FROM ghcr.io/chiragbidx/saas-base:latest

WORKDIR /app
COPY . .

CMD ["node", "scripts/dev-supervisor.js"]
