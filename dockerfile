FROM docker.io/library/node:21.5
 
WORKDIR /bot
 
COPY ./package*.json .
RUN npm install
 
COPY . .

RUN npx prisma generate
 
RUN npm run build

ENV PORT=3333

EXPOSE 3333
 
CMD [ "npm", "start" ]