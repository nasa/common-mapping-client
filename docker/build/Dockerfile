# PREPARE STAGE
ARG IMAGE_REGISTRY
ARG DOCKER_IMAGE="node:12-slim"
FROM $IMAGE_REGISTRY$DOCKER_IMAGE AS prepare
ARG CACHE_DIR=/tmp/.build-cache
WORKDIR $CACHE_DIR

# Copy need files, to check deps
COPY package.json .
COPY package-lock.json .

# set app version to 0.0.0 in order not to upload dependencies if only version change
RUN sed -i '1,/version/{x;/first/s///;x;s/version\": \".*\"/version\": \"0.0.0\"/;}' package.json
RUN sed -i '1,/version/{x;/first/s///;x;s/version\": \".*\"/version\": \"0.0.0\"/;}' package-lock.json

# BUILD STAGE
FROM $IMAGE_REGISTRY$DOCKER_IMAGE AS build
ARG CACHE_DIR=/tmp/.build-cache
WORKDIR $CACHE_DIR

# install system libraries
RUN apt update && \
    apt -y install git bzip2 curl

# get cached unversioned packages
COPY --from=prepare $CACHE_DIR/package.json .
COPY --from=prepare $CACHE_DIR/package-lock.json .
# get postinstall script and requirements
COPY scripts/postinstall.sh ./scripts/postinstall.sh
COPY lib ./lib
COPY src/_core/styles/resources/img/CesiumDrawHelper/*.png ./src/_core/styles/resources/img/CesiumDrawHelper/

# caching npm depedencies
RUN npm ci --unsafe-perm

# remove files not needed for building from cache directory
RUN rm -Rf lib scripts src
RUN rm package.json package-lock.json

WORKDIR /build
