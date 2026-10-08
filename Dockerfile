# Usar la imagen de Nginx sin privilegios de root para cumplir con reglas de seguridad estrictas (SonarQube)
FROM nginxinc/nginx-unprivileged:alpine

# Copiar explícitamente los directorios y archivos necesarios para evitar reglas S6470 de SonarQube
COPY assets/ /usr/share/nginx/html/assets/
COPY index.html /usr/share/nginx/html/

# Exponer el puerto 8080 (puerto por defecto para usuarios sin privilegios)
EXPOSE 8080

# Nginx se inicia automáticamente como proceso principal
CMD ["nginx", "-g", "daemon off;"]
