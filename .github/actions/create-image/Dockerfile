FROM nginx:1.16.0-alpine
COPY ./dist/ngrx-store-storagesync-app/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
