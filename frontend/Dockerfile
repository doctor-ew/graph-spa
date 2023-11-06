# Use the official lightweight Node.js image.
FROM node:20-alpine

# Install Yarn
RUN apk add --no-cache yarn

# Set the working directory
WORKDIR /app

# Copy package.json, yarn.lock, and next.config.js files
COPY package.json yarn.lock next.config.js ./

# Install dependencies
RUN yarn install

# Copy local code to the container
COPY . .

# Build the application
RUN yarn build

# Expose the port Next.js will run on
EXPOSE 3000

# Start the Next.js application
CMD ["yarn", "dev"]
