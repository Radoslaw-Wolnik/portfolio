#!/bin/bash
# update_project.sh

set -e

PROJECT_NAME=$1
BRANCH=${2:-main}

if [ -z "$PROJECT_NAME" ]; then
    echo "Usage: $0 <project_name> [branch]"
    exit 1
fi

# Update the repository
cd /tmp/$PROJECT_NAME
git fetch
git checkout $BRANCH
git pull

# Rebuild the Docker image
docker build -t $PROJECT_NAME:latest .

# Stop the old container
docker stop $PROJECT_NAME

# Start a new container with the updated image
docker run -d --name $PROJECT_NAME --network ${PROJECT_NAME}_network $PROJECT_NAME:latest

# Add Traefik labels
docker container update \
    --label-add "traefik.enable=true" \
    --label-add "traefik.http.routers.$PROJECT_NAME.rule=Host(\`$PROJECT_NAME.${DOMAIN_NAME}\`)" \
    --label-add "traefik.http.routers.$PROJECT_NAME.entrypoints=websecure" \
    --label-add "traefik.http.routers.$PROJECT_NAME.tls=true" \
    $PROJECT_NAME

echo "Project $PROJECT_NAME updated successfully"
