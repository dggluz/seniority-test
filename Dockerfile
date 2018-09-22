FROM node:latest

# Create app directory
WORKDIR /usr/app

# Install app dependencies
COPY server/package*.json ./
COPY server/tsconfig.json ./
RUN npm install

# Bundle app source
COPY server/src ./src

EXPOSE 8080
CMD [ "npm", "run", "build-and-run" ]
