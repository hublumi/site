FROM nginx:alpine

# Copia todos os arquivos do site para o diretório padrão do Nginx
COPY . /usr/share/nginx/html

# Expõe a porta 80
EXPOSE 80

# Inicia o servidor web Nginx
CMD ["nginx", "-g", "daemon off;"]
