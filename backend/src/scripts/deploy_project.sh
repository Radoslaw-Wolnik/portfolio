#!/bin/bash
# deploy_project.sh

set -e

PROJECT_NAME=$1
GIT_URL=$2
BRANCH=${3:-main}

if [ -z "$PROJECT_NAME" ] || [ -z "$GIT_URL" ]; then
    echo "Usage: $0 <project_name> <git_url> [branch]"
    exit 1
fi

# Clone the repository
git clone --branch $BRANCH $GIT_URL /tmp/$PROJECT_NAME

# Build the Docker image
docker build -t $PROJECT_NAME:latest /tmp/$PROJECT_NAME

# Create a network for the project
docker network create ${PROJECT_NAME}_network

# Start the container
docker run -d --name $PROJECT_NAME --network ${PROJECT_NAME}_network $PROJECT_NAME:latest

# Add Traefik labels
docker container update \
    --label-add "traefik.enable=true" \
    --label-add "traefik.http.routers.$PROJECT_NAME.rule=Host(\`$PROJECT_NAME.${DOMAIN_NAME}\`)" \
    --label-add "traefik.http.routers.$PROJECT_NAME.entrypoints=websecure" \
    --label-add "traefik.http.routers.$PROJECT_NAME.tls=true" \
    $PROJECT_NAME

echo "Project $PROJECT_NAME deployed successfully"#!/bin/bash
# deploy_project.sh

set -e

PROJECT_NAME=$1
GIT_URL=$2
BRANCH=${3:-main}

if [ -z "$PROJECT_NAME" ] || [ -z "$GIT_URL" ]; then
    echo "Usage: $0 <project_name> <git_url> [branch]"
    exit 1
fi

# Clone the repository
git clone --branch $BRANCH $GIT_URL /tmp/$PROJECT_NAME

# Build the Docker image
docker build -t $PROJECT_NAME:latest /tmp/$PROJECT_NAME

# Create a network for the project
docker network create ${PROJECT_NAME}_network

# Start the container
docker run -d --name $PROJECT_NAME --network ${PROJECT_NAME}_network $PROJECT_NAME:latest

# Add Traefik labels
docker container update \
    --label-add "traefik.enable=true" \
    --label-add "traefik.http.routers.$PROJECT_NAME.rule=Host(\`$PROJECT_NAME.${DOMAIN_NAME}\`)" \
    --label-add "traefik.http.routers.$PROJECT_NAME.entrypoints=websecure" \
    --label-add "traefik.http.routers.$PROJECT_NAME.tls=true" \
    $PROJECT_NAME

echo "Project $PROJECT_NAME deployed successfully"