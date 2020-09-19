FROM node:13 as build-stage

WORKDIR /app
COPY . ./
RUN npm install
# RUN npm run build

# FROM nginx:stable-alpine as production-stage
# COPY --from=build-stage /app/dist /usr/share/nginx/html
# COPY nginx_config/default.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80
