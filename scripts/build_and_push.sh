#!/bin/bash

ENV=$1
VERSION=$2

DEV_PROJECT_ID="motrpac-portal-dev"
PROD_PROJECT_ID="motrpac-portal"

DEV_COMPOSE_FILE="docker-compose.dev.yaml"
PROD_COMPOSE_FILE="docker-compose.yaml"

function tag_with_latest_and_version() {
    project_id=$1
    compose_file=$2

    docker compose -f "$compose_file" build
    docker tag "motrpac-frontend:latest" "us-docker.pkg.dev/$project_id/datahub/frontend:$VERSION"
    docker push "us-docker.pkg.dev/$project_id/datahub/frontend:latest"
    docker push "us-docker.pkg.dev/$project_id/datahub/frontend:$VERSION"
}

if [[ $ENV = "dev" ]]; then
  tag_with_latest_and_version $DEV_PROJECT_ID $DEV_COMPOSE_FILE
  exit 0
fi

if [[ $ENV = "prod" ]]; then
  tag_with_latest_and_version $PROD_PROJECT_ID $PROD_COMPOSE_FILE
  exit 0
fi

if [[ $ENV = "both" ]]; then
  tag_with_latest_and_version $DEV_PROJECT_ID $DEV_COMPOSE_FILE
  tag_with_latest_and_version $PROD_PROJECT_ID $PROD_COMPOSE_FILE
  exit 0
fi


echo "Invalid environment. Please use 'dev' or 'prod'."
exit 1
