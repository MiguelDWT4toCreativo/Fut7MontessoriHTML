# Dockerfile

# Usa la imagen oficial de PHP con Apache
FROM php:8.2-apache

# Instala las extensiones de PHP necesarias
RUN docker-php-ext-install pdo pdo_mysql

# Habilita los módulos de Apache para procesar PHP
RUN a2enmod php
RUN service apache2 restart

# Copia el contenido de tu proyecto en el directorio del servidor
COPY . /var/www/html/

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /var/www/html/

# Establece los permisos correctos para los archivos y directorios
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html

# Exponemos el puerto 80 para que sea accesible desde el exterior del contenedor
EXPOSE 80
