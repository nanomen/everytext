FROM node:10.5.0

COPY package.json package.json
RUN npm i
RUN npm i pm2 -g
COPY . .
CMD ["pm2-runtime", "server/index.js"]

EXPOSE 8080
