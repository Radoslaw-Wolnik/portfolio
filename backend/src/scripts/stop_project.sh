#!/bin/bash
# stop_project.sh

set -e

PROJECT_NAME=$1

if [ -z "$PROJECT_NAME" ]; then
    echo "Usage: $0 <project_name>"
    exit 1
fi

# Stop and remove the container
docker stop $PROJECT_NAME
docker rm $PROJECT_NAME

# Remove the network
docker network rm ${PROJECT_NAME}_network

# Remove Traefik configuration
sed -i "/$PROJECT_NAME/d" /etc/traefik/dynamic_conf/routing.yml

echo "Project $PROJECT_NAME stopped and removed successfully"
