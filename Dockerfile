FROM nginx:alpine

# Copia a configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia todos os arquivos do site para o diretório padrão do Nginx
COPY . /usr/share/nginx/html

# O Google Cloud Run espera a porta 8080 por padrão
EXPOSE 8080

# Inicia o servidor web Nginx
CMD ["nginx", "-g", "daemon off;"]
