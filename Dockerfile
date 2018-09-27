# Multistage build

# First stage: client (compile client code)
FROM node:latest as client

# Use app directory
WORKDIR /usr/app

# Install client dependencies
COPY client/package*.json ./
RUN npm install

# Build client code
COPY client/src ./src
COPY client/index.html ./
COPY client/jest.config.js ./
COPY server/tsconfig.json ./
COPY client/webpack.config.js ./
RUN npm run build

# Second stage: node server
FROM node:latest

# Use app directory
WORKDIR /usr/app

# Create folder for images and static files
RUN mkdir -p static/images

# Copy the client assets to the static directory
COPY --from=client /usr/app/index.html ./static 
COPY --from=client /usr/app/js ./static/js

# Install app dependencies
COPY server/package*.json ./
RUN npm install

# Bundle app source
COPY server/tsconfig.json ./
COPY server/src ./src

EXPOSE 8080
CMD [ "npm", "run", "build-and-run" ]
