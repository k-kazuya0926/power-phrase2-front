FROM node:12.18.4 as build-stage

WORKDIR /app
COPY . ./
RUN npm install
