FROM nginx:1.10.2


# This Dockerfile assumes assets are pre-built

ENV SRV_DIR /usr/share/nginx/html/
ENV NGINX_CONF /etc/nginx/

# Move the source code into the container
COPY ../../branches/* ${SRV_DIR}

# Move over the server config
COPY ./nginx.conf ${NGINX_CONF}