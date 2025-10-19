# stage 1 : Build the Node.js app

# Node.js official image
From node:18-alpine AS build-stage

# Set the working directory
WORKDIR /app

# Copy the packages
COPY package*.json ./

# Run npm
RUN npm install

# Copy all the code
COPY . .

# Stage 2 : Run the Node.js app
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy from build stage
COPY --from=build-stage /app/. .

# Set env variables
ENV NODE_ENV production

# Expose the port
EXPOSE 8081

# Run the Node.js application
CMD ["node","app.js"]
