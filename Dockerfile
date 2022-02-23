FROM nginx:stable-alpine

USER root

# Install nginx with node and npm
RUN apk add --no-cache --repository http://nl.alpinelinux.org/alpine/edge/main libuv \
    && apk add --no-cache --update-cache --repository http://dl-cdn.alpinelinux.org/alpine/edge/main nodejs=16.13.2-r1 npm=8.3.0-r0 \
    && echo "NodeJS Version:" "$(node -v)" \
    && echo "NPM Version:" "$(npm -v)"


# Make directory
RUN mkdir -p /home/node/app

# Copy data
WORKDIR /home/node/app
COPY . .

# Install backend
WORKDIR "/home/node/app/backend api bridge"
RUN npm install

# Install frontend
WORKDIR "/home/node/app"
RUN npm install
RUN npm run build

# Put front end in nginx exposed folder
COPY ["./dist", "/usr/share/nginx/html"]

# Expose api and frontend
EXPOSE 5000
EXPOSE 80

# script to run when container starts
CMD ["/bin/sh", "./scripts/start_app.sh"]

