# Usa a versão 22 do Node.js como base
FROM node:22

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Atualiza o NPM para a versão mais recente
RUN npm install -g npm@latest

# Copia apenas os arquivos de dependências primeiro para otimizar o cache do Docker
COPY package.json  ./

# Instala as dependências sem conflitos de versões
RUN npm install --legacy-peer-deps

# Copia o restante do código para dentro do container
COPY . .

# Expor a porta usada pela API
EXPOSE 3333

# Comando para iniciar a aplicação
CMD ["npm", "run", "start:dev"]
