# Project Management and Docker Services Documentation

## Table of Contents
1. [Overview](#overview)
2. [Project Demo Management](#project-demo-management)
3. [Docker Services](#docker-services)
4. [Image Prebuilding](#image-prebuilding)

## Overview

This document describes the advanced features of our system, including project demo management, Docker services, and image prebuilding. These services are designed to provide a seamless experience for managing and demonstrating projects in isolated environments.

## Project Demo Management

### Start or Join Project Demo
```
🔒 POST /api/project-demo/start-or-join
Body: { projectName: string, username: string }
Response: { 
  message: "Project demo started",
  sessionId: string,
  token: string,
  demoUrl: string,
  credentials: { username: string, password: string }
}
```

### Get Project Demo Status
```
🔒 GET /api/project-demo/:sessionId/status
Response: DockerSession
```

### Leave Project Demo
```
🔒 POST /api/project-demo/:sessionId/leave
Response: { message: "Left project demo successfully" }
```

### Switch Role
```
🔒 POST /api/project-demo/:sessionId/switch-role
Body: { newRole: string }
Response: { message: "Role switched successfully", token: string, credentials: { username: string, password: string } }
```

## Docker Services

Our Docker services provide the backbone for creating and managing isolated project environments. These services are not directly exposed through the API but are used internally by the project demo management system.

### Key Features:
- Dynamic container creation based on project configurations
- Automatic port assignment and management
- Secure environment variable injection
- Container lifecycle management (creation, starting, stopping, removal)

### Internal Methods:
- `createContainer(projectName: string, sessionId: string): Promise<string>`
- `stopContainer(containerId: string): Promise<void>`
- `getContainerPort(containerId: string): Promise<string>`
- `cleanupInactiveContainers(): Promise<string[]>`

## Image Prebuilding

To optimize the startup time of project demos, we implement an image prebuilding system. This system creates and updates Docker images for each project in advance.

### Prebuild Image Job
```
🔑 POST /api/jobs/prebuildImages
Response: { message: "Image prebuilding job started" }
```

### Get Prebuild Status
```
🔑 GET /api/jobs/prebuildImages/status
Response: { status: string, completedProjects: number, totalProjects: number }
```

### Key Features:
- Automatic scheduling of image builds
- Version control integration for detecting changes
- Parallel building of multiple project images
- Caching mechanisms to speed up subsequent builds

### Internal Process:
1. Fetch list of all projects
2. For each project:
   a. Check if the project files have changed since the last build
   b. If changes detected, trigger a new image build
   c. Tag and store the new image
3. Clean up old, unused images

## WebSocket Service

We use WebSockets to provide real-time updates about the status of containers and project demos.

### Events:
- `containerStatus`: Emitted when the status of a container changes
- `sessionUpdate`: Emitted when there are updates to a project demo session

### Usage:
Clients can connect to the WebSocket service and listen for these events to provide real-time feedback to users about the status of their project demos.

## Security Considerations

- All project demos run in isolated Docker containers
- Network access is restricted to only necessary services
- Containers are automatically removed after a period of inactivity
- User permissions are strictly controlled within demo environments