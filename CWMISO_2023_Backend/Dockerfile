FROM node:18.16.0

WORKDIR  /sao2023
COPY package*.json ./
RUN npm i
COPY . /sao2023

EXPOSE 5000
CMD ["npm", "run", "dev"]