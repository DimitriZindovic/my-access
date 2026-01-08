FROM php:8.4-fpm-alpine

RUN apk add --no-cache nginx supervisor postgresql-dev libpng-dev libzip-dev oniguruma-dev nodejs npm git curl

RUN docker-php-ext-install pdo pdo_pgsql mbstring zip gd

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --optimize-autoloader

COPY package.json package-lock.json ./
RUN npm ci && npm run build

COPY . .

RUN composer dump-autoload --optimize --classmap-authoritative --no-dev

RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 755 storage bootstrap/cache

RUN echo 'server { listen 8080; root /var/www/html/public; index index.php; location / { try_files $uri $uri/ /index.php?$query_string; } location ~ \.php$ { fastcgi_pass 127.0.0.1:9000; fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name; include fastcgi_params; } }' > /etc/nginx/http.d/default.conf

RUN echo '[supervisord]\nnodaemon=true\n[program:php-fpm]\ncommand=php-fpm\nautostart=true\nautorestart=true\n[program:nginx]\ncommand=nginx -g "daemon off;"\nautostart=true\nautorestart=true' > /etc/supervisor/conf.d/supervisord.conf

RUN echo '#!/bin/sh\nphp artisan migrate --force || true\nphp artisan config:cache || true\nphp artisan route:cache || true\nexec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf' > /entrypoint.sh && chmod +x /entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/entrypoint.sh"]
