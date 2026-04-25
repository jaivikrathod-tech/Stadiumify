# Use Nginx to serve the static Expo web build
FROM nginx:alpine

# Copy the built Expo web files to Nginx's default public directory
COPY dist/ /usr/share/nginx/html

# Expose port 8080 (Cloud Run requires the app to listen on $PORT, default 8080)
EXPOSE 8080

# Configure Nginx to listen on $PORT by replacing the default 80 port in the config
CMD sed -i -e 's/listen.*/listen '"$PORT"';/' /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'
