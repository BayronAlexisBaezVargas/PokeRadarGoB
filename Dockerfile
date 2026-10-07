# Usar la imagen oficial y ultraligera de Nginx basada en Alpine Linux
FROM nginx:alpine

# Copiar los archivos estáticos del proyecto al directorio que sirve Nginx
COPY . /usr/share/nginx/html/

# Exponer el puerto 80 para tráfico web
EXPOSE 80

# Nginx se inicia automáticamente como proceso principal
CMD ["nginx", "-g", "daemon off;"]
