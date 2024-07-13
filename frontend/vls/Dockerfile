# Use an official Node.js runtime as the base image
FROM node:16.20.2

# Set the working directory in the container
WORKDIR /app/vls

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Install a simple HTTP server to serve the static files
RUN npm install -g serve

# Expose the port your app runs on
EXPOSE 3000

# Start the app
CMD ["serve", "-s", "build"]
