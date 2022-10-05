#!/bin/sh
SCRIPT_DIR=$(dirname $0)
BASEDIR=$(cd "${SCRIPT_DIR}" && pwd -P)

PORT=$1
PROFILE=$2
VERSION=$3
[[ "_${VERSION}" = "_" ]] && VERSION=develop
[[ "_${PORT}" = "_" && "${VERSION}" = "develop" ]] && PORT=3000
[[ "_${PROFILE}" = "_" ]] && PROFILE=ifremer

CI_REGISTRY=gitlab-registry.ifremer.fr
CI_PROJECT_NAME=common-mapping-client
CI_PROJECT_PATH=ifremer-commons/reactjs
CI_REGISTRY_IMAGE_PATH=${CI_REGISTRY}/${CI_PROJECT_PATH}
CI_REGISTER_USER=gitlab+deploy-token
CI_REGISTER_PWD=2gSCrTHB69zHqtbMmFMM
CI_REGISTRY_IMAGE=${CI_REGISTRY_IMAGE_PATH}:${VERSION}
CONTAINER_PREFIX="${CI_PROJECT_NAME}-${PORT}"
CONTAINER_NAME="${CONTAINER_PREFIX}-${VERSION}"
CONFIG_DIR=${CONFIG}/${PROFILE}

# Check arguments
if [[ (! $VERSION =~ ^[0-9]+.[0-9]+.[0-9]+(-(alpha|beta|rc|SNAPSHOT)[-0-9]*)?$) && !($VERSION == 'develop' || $VERSION == 'feature') ]]; then
  echo "ERROR: Invalid version"
  echo " Usage: $0 <port> <version>"
  exit 1
fi
if [[ (! $PORT =~ ^[0-9]+$ ) ]]; then
  echo "ERROR: Invalid port"
  echo " Usage: $0 <port> <version>"
  exit 1
fi

# Log start
echo "--- Starting ${CI_PROJECT_NAME} v${APP_VERSION} on port ${PORT} (profile: '${PROFILE}')'}"
echo "--- Configurations : ${CONFIG_DIR}"

## Login to container registry
echo "Login to ${CI_REGISTRY}..."
echo ${CI_REGISTER_PWD} | docker login ${CI_REGISTRY} --password-stdin -u ${CI_REGISTER_USER}
[[ $? -ne 0 ]] && exit 1

# Pull the expected image
echo "Pulling image ${CI_REGISTRY_IMAGE}"
docker pull ${CI_REGISTRY_IMAGE}
[[ $? -ne 0 ]] && exit 1

# Logout from container registry
docker logout ${CI_REGISTRY}

# Stop existing container
if [[ ! -z  $(docker ps -f name=${CONTAINER_PREFIX} -q) ]]; then
  echo "Stopping running instance..."
  docker stop $(docker ps -f name=${CONTAINER_PREFIX} -q)
fi

# Waiting container really removed
sleep 3

docker run -it -d --rm \
           --name "${CONTAINER_NAME}" \
           -p ${PORT}:8080 \
           -e PROFILE=${PROFILE} \
           ${CI_REGISTRY_IMAGE}

echo "---- ${CI_PROJECT_NAME} is running !"
echo ""
echo " Available commands:"
echo "    logs: docker logs -f ${CONTAINER_NAME}"
echo "    bash: docker exec -it ${CONTAINER_NAME} bash"
echo "    stop: docker stop ${CONTAINER_NAME}"
echo "  status: docker ps -a ${CONTAINER_NAME}"
