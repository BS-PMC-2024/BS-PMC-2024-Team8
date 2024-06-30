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

# Expose the port your app runs on
EXPOSE 3000

# Command to run your application
CMD ["npm", "start"]
