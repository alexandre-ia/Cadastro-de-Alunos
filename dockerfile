# Usa uma imagem leve com servidor web (Nginx)
FROM nginx:alpine

# Copia todos os arquivos do projeto para o diretório padrão do Nginx
COPY . /usr/share/nginx/html

# Expõe a porta padrão do Nginx
EXPOSE 80

# O Nginx já inicia automaticamente, então não precisamos definir CMD
# docker build -t registro-alunos.
# docker run -d -p 8080:80 registro-alunos
