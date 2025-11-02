# 1️⃣ Gunakan Node.js resmi
FROM node:20-alpine

# 2️⃣ Tentukan working directory di container
WORKDIR /usr/src/app

# 3️⃣ Copy package.json dan package-lock.json terlebih dahulu
COPY package*.json ./

# 4️⃣ Install dependencies
RUN npm install --production

# 5️⃣ Copy semua file project ke container
COPY . .

# 6️⃣ Tentukan port (sesuaikan dengan port di indeks.js)
EXPOSE 5000

# 7️⃣ Jalankan aplikasi
CMD ["node", "src/indeks.js"]
