FROM nginx:1.10.2


# This Dockerfile assumes assets are pre-built and this is run from `cmc-core/`

ENV SRV_DIR /usr/share/nginx/html/cmc-core
ENV NGINX_CONF /etc/nginx/

# Make the cmc-core serving directory
RUN mkdir ${SRV_DIR}

# Move the source code into the container
COPY ./branches ${SRV_DIR}

# Move over the server config
COPY ./scripts/deployAssets/nginx.conf ${NGINX_CONF}