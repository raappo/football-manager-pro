FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Run Vite development server
CMD ["npm", "run", "dev"]