ARG IMAGE_REGISTRY
ARG DOCKER_IMAGE="nginx:alpine"
FROM $IMAGE_REGISTRY$DOCKER_IMAGE

# Build arg
ARG ENTRYPOINT=docker/run/app.sh
ARG NGINX_CONF=docker/run/nginx.conf
ARG ENVIRONMENTS=docker/run/environments
ARG HTML=dist
ARG USERNAME="nginx"
ARG GROUPNAME="nginx"

# nginx conf
COPY ${NGINX_CONF} /etc/nginx/conf.d/default.conf
RUN touch /var/run/nginx.pid && \
    chown -R ${USERNAME}:${GROUPNAME} /var/run/nginx.pid && \
    chown -R ${USERNAME}:${GROUPNAME} /var/cache/nginx && \
    mkdir /app && \
    chown -R ${USERNAME}:${GROUPNAME} /app

# Copy files
COPY --chown=${USERNAME}:${GROUPNAME} ${HTML} /app/www
COPY --chown=${USERNAME}:${GROUPNAME} ${ENVIRONMENTS} /app/environments
COPY --chown=${USERNAME}:${GROUPNAME} ${ENTRYPOINT} /app/app.sh
RUN chmod +x /app/app.sh

USER ${USERNAME}

# Port 80 is reserved for root user
EXPOSE 8080
ENTRYPOINT ["/app/app.sh"]
CMD ["nginx", "-g", "daemon off;"]
