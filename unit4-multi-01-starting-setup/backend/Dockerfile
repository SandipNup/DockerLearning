FROM node

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 80

#these environment variable are passed through command line
ENV MONGODB_USERNAME=giveusername  

ENV MONGODB_PASSWORD=givepassword

CMD [ "npm", "start" ]