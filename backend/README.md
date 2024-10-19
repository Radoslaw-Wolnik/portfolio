# Project Management Backend

This project is a backend system for managing projects, Docker containers, and user authentication. It provides a robust API for creating and managing projects, handling Docker sessions, and performing various administrative tasks.

## Features

- User authentication and authorization
- Project management with Docker integration
- Real-time updates using WebSockets
- Background job scheduling
- Health monitoring and logging
- File upload handling
- Blog post management
- Site settings management

## Prerequisites

- Node.js (v14 or later)
- MongoDB
- Docker
- Traefik (for routing)

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/project-management-backend.git
   cd project-management-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add the necessary environment variables (see Configuration section).

4. Start the MongoDB service.

5. Start the application:
   ```
   npm run dev
   ```

## Configuration

The application uses environment variables for configuration. Create a `.env` file in the root directory with the following variables:

```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/myapp
JWT_SECRET=your_jwt_secret
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=your_admin_password
ENCRYPTION_KEY=your-encryption-key
DOCKER_SOCKET_PATH=/var/run/docker.sock
TRAEFIK_CONFIG_PATH=/path/to/traefik/config
FRONTEND_URL=http://localhost:3000
```

Adjust the values according to your setup.

## Project Structure

### Middlewares

The application uses several middleware functions to handle various aspects of request processing:

1. **Authentication Middleware**: Verifies JWT tokens and handles user authentication for both regular and demo users.
2. **Error Handling Middleware**: Provides centralized error handling and formatting for consistent API responses.
3. **Request ID Middleware**: Adds a unique identifier to each request for improved traceability and logging.
4. **Role-based Access Control Middleware**: Manages access to routes based on user roles.
5. **File Upload Middleware**: Handles file uploads using Multer, supporting various types of uploads (e.g., profile pictures, blog images).

### Services

The application is built around a service-oriented architecture, with each service responsible for a specific domain of functionality:

1. **Docker Service**: Manages interactions with Docker, including creating, starting, and stopping containers. It also handles image building and network management.
2. **Project Service**: Handles CRUD operations for projects, including deployment, freezing, and unfreezing of projects.
3. **Docker Session Service**: Manages Docker sessions for projects, including creation, termination, and user swapping within sessions.
4. **Monitoring Service**: Provides health checks and resource monitoring for both the application and individual projects.
5. **Backup Service**: Manages project backups and restorations, ensuring data persistence and recovery options.
6. **Routing Service**: Interacts with Traefik to manage dynamic routing configurations for projects.
7. **Cron Service**: Manages scheduled jobs and background tasks, such as cleanup operations and regular backups.
8. **WebSocket Service**: Provides real-time updates to clients about project and container statuses.

These services work together to provide a comprehensive project management system, handling everything from user authentication to Docker container management and real-time monitoring.

## API Documentation

For detailed API documentation, including all available endpoints and their usage, please refer to the [API Documentation](./API_DOCUMENTATION.md).

## Data Models

For information about the data models used in this application, including their schemas and relationships, please see the [Models Documentation](./MODELS_DOCUMENTATION.md).

## Development

To run the application in development mode with hot reloading:

```
npm run dev
```

## Testing

To run the test suite:

```
npm test
```

## Building for Production

To build the application for production:

```
npm run build
```

To start the production server:

```
npm start
```

## Docker Support

The application includes a Dockerfile for containerization. To build and run the Docker container:

```
docker build -t project-management-backend .
docker run -p 3000:3000 project-management-backend
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.