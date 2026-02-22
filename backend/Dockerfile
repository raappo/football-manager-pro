FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the backend source code
COPY . .

# Expose the API port
EXPOSE 5000

# Run the dev server with hot-reloading
CMD ["npm", "run", "dev"]