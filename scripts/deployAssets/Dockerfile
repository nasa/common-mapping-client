FROM nginx:1.10.2


# This Dockerfile assumes assets are pre-built and are available under `dist/`

ENV BUNDLE_DIR dist
ENV SRV_DIR /usr/share/nginx/html/app
ENV SRC_NGINX_CONF scripts/deployAssets/nginx.conf
ENV NGINX_CONF_DIR /etc/nginx/

# Make the cmc-core serving directory
RUN mkdir ${SRV_DIR}

# Move the source code into the container
COPY ${BUNDLE_DIR} ${SRV_DIR}

# Move over the server config
COPY ${SRC_NGINX_CONF} ${NGINX_CONF_DIR}