# Utiliser l'image officielle de PHP 8.2 avec Apache
FROM php:8.2-apache

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Installer Git
RUN apt-get update && apt-get install -y git

# Définir le répertoire de travail
WORKDIR /Perf.io

# Modifier le répertoire racine d'Apache
RUN sed -i 's|/var/www/html|/Perf.io|g' /etc/apache2/sites-available/000-default.conf