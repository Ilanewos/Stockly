# 1. Gunakan Node.js official image
FROM node:20-alpine

# 2. Tentukan working directory di container
WORKDIR /usr/src/app

# 3. Copy file package.json dan package-lock.json dulu untuk caching npm install
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy seluruh project ke container
COPY . .

# 6. Ekspos port yang digunakan aplikasi
EXPOSE 3000

# 7. Jalankan Node.js
CMD ["node", "index.js"]