FROM node:14

WORKDIR /usr/src/app

COPY ./userapi/package*.json ./

RUN npm install

COPY ./userapi/ .

EXPOSE 8080

CMD [ "npm", "start" ]

