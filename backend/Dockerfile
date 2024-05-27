FROM  node:lts-alpine3.20
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
RUN mkdir images
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]