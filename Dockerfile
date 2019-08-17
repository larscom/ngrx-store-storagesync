# base image
FROM node:12.2.0 as node-env

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# add app
COPY . /app

# install and cache app dependencies
RUN npm ci

# generate build
RUN npm run build:app

# base image
FROM nginx:1.16.0-alpine

# copy artifact build from the 'node-env environment'
COPY --from=node-env /app/dist/ngrx-store-storagesync-app /usr/share/nginx/html

# expose port 80
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]
