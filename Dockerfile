FROM node:24-alpine

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./ 
RUN npm install --production

# Copy app source code
COPY index.js .

ENTRYPOINT ["node", "index.js"]
