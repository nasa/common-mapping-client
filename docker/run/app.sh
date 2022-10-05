#!/bin/sh
APP_NAME=common-mapping-client
BASEDIR=/app
LOG_DIR=/app/logs
echo "*** Starting ${APP_NAME} ***"
# overwrite config with profile config
if [[ "_$PROFILE" != "_" ]]; then
    echo "*** with profile: ${PROFILE} ***"
    CONFIG_FILE=/app/environments/config-${PROFILE}.js
    [ -f $CONFIG_FILE ] && cp $CONFIG_FILE /app/www/config.js || echo "$CONFIG_FILE does not exist, please add it to environment directory"
fi

# start nginx by executing default entrypoint
/docker-entrypoint.sh "$@"
