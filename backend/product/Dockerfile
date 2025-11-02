# Gunakan image Node versi stabil
FROM node:18

# Tentukan working directory di container
WORKDIR /app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Install dependency
RUN npm install

# Salin semua kode project ke dalam container
COPY . .

# Set environment default
ENV PORT=4000

# Buka port 4000 untuk akses backend
EXPOSE 4000

# Jalankan aplikasi
CMD ["npm", "start"]
