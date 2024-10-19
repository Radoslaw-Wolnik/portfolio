# Data Models

This document outlines the data models used in the Project Management Backend application.

## User

Represents a user in the system.

### Schema

| Field       | Type     | Description                              | Constraints                       |
|-------------|----------|------------------------------------------|------------------------------------|
| _id         | ObjectId | Unique identifier                        | Auto-generated                     |
| username    | String   | User's username                          | Required, Unique, 3-30 characters  |
| password    | String   | Hashed password                          | Required, Min 8 characters         |
| role        | String   | User's role in the system                | Enum: ['admin'], Default: 'admin'  |
| createdAt   | Date     | Timestamp of user creation               | Auto-generated                     |
| updatedAt   | Date     | Timestamp of last update                 | Auto-updated                       |

### Methods

- `comparePassword(candidatePassword: string): Promise<boolean>`
  - Compares a candidate password with the stored hashed password.

### Static Methods

- `createDefaultAdmin(): Promise<IUserDocument>`
  - Creates or updates the default admin user.

## BlogPost

Represents a blog post in the system.

### Schema

| Field            | Type     | Description                    | Constraints  |
|------------------|----------|--------------------------------|--------------|
| _id              | ObjectId | Unique identifier              | Auto-generated |
| title            | String   | Title of the blog post         | Required     |
| shortDescription | String   | Brief description of the post  | Required     |
| content          | Array    | Content blocks of the post     | Required     |
| tags             | [String] | Tags associated with the post  |              |
| author           | ObjectId | Reference to the User model    | Required     |
| createdAt        | Date     | Timestamp of post creation     | Auto-generated |
| updatedAt        | Date     | Timestamp of last update       | Auto-updated |

#### Content Block Schema

| Field    | Type   | Description                       | Constraints            |
|----------|--------|-----------------------------------|-----------------------|
| type     | String | Type of content block             | Enum: ['text', 'code', 'image', 'link'] |
| content  | String | Content of the block              | Required              |
| language | String | Programming language (for code)   | Optional              |
| alt      | String | Alt text (for images)             | Optional              |

## DockerSession

Represents a Docker session for project demonstrations.

### Schema

| Field        | Type     | Description                         | Constraints    |
|--------------|----------|-------------------------------------|----------------|
| _id          | ObjectId | Unique identifier                   | Auto-generated |
| sessionId    | String   | Unique session identifier           | Required, Unique |
| userId       | ObjectId | Reference to the User model         | Required       |
| projectName  | String   | Name of the project                 | Required       |
| username     | String   | Username for the session            | Required       |
| containerSessionId | String | ID of the Docker container session | Required       |
| startTime    | Date     | Start time of the session           | Required       |
| endTime      | Date     | End time of the session             | Optional       |
| lastActivityTime | Date | Time of last activity in the session | Auto-updated   |
| lastSwitchTime | Date   | Time of last user switch            | Optional       |
| status       | String   | Status of the session               | Enum: ['active', 'terminated'], Default: 'active' |

## Project

Represents a project in the system.

### Schema

| Field            | Type     | Description                         | Constraints    |
|------------------|----------|-------------------------------------|----------------|
| _id              | ObjectId | Unique identifier                   | Auto-generated |
| name             | String   | Name of the project                 | Required, Unique |
| gitUrl           | String   | Git repository URL                  | Required       |
| branch           | String   | Git branch to use                   | Required, Default: 'main' |
| dockerComposeFile| String   | Path to Docker Compose file         | Required, Default: 'docker-compose.yml' |
| subdomain        | String   | Subdomain for the project           | Required, Unique |
| status           | String   | Current status of the project       | Enum: ['running', 'stopped', 'error', 'frozen'], Default: 'stopped' |
| containers       | [Container] | List of containers in the project | Required       |

### Container Schema

| Field | Type   | Description                   | Constraints    |
|-------|--------|-------------------------------|----------------|
| name  | String | Name of the container         | Required       |
| port  | Number | Port number for the container | Required       |
| type  | String | Type of the container         | Enum: ['frontend', 'backend', 'database', 'other'], Required |

## SiteSettings

Represents the global settings for the site.

### Schema

| Field            | Type   | Description                     | Constraints    |
|------------------|--------|---------------------------------|----------------|
| _id              | ObjectId | Unique identifier             | Auto-generated |
| siteName         | String | Name of the site                | Required, Default: "My Site" |
| siteDescription  | String | Description of the site         | Required, Default: "Welcome to my site" |
| siteKeywords     | [String] | Keywords for SEO              | Optional       |
| socialMediaLinks | Object | Social media profile links      | Optional       |
| logoUrl          | String | URL of the site logo            | Optional, Default: "/default-logo.png" |

### Static Methods

- `findOneOrCreate(condition: any, doc: any): Promise<ISiteSettingsDocument>`
  - Finds an existing document or creates a new one if it doesn't exist.

## DemoUser

Represents a demo user for project demonstrations.

### Schema

| Field    | Type     | Description                   | Constraints    |
|----------|----------|-------------------------------|----------------|
| _id      | ObjectId | Unique identifier             | Auto-generated |
| username | String   | Username for the demo user    | Required       |
| password | String   | Hashed password               | Required       |
| project  | ObjectId | Reference to the Project model| Required       |
| role     | String   | Role of the demo user         | Required       |
| createdAt| Date     | Creation timestamp            | Auto-generated, Expires after 24 hours |
