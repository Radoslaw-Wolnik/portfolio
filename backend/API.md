# API Documentation

## Table of Contents
1. [Authentication](#authentication)
2. [User Routes](#user-routes)
3. [Admin Routes](#admin-routes)
4. [Auth Routes](#auth-routes)
5. [Health Routes](#health-routes)
6. [Job Routes](#job-routes)
7. [Site Settings Routes](#site-settings-routes)
8. [Blog Routes](#blog-routes)
9. [Docker Session Routes](#docker-session-routes)
10. [Project Routes](#project-routes)
11. [Demo User Routes](#demo-user-routes)
12. [Account Routes](#account-routes)

## Authentication

Most endpoints require authentication. Authentication is handled using HTTP-only cookies. When a user logs in successfully, the server will set a secure, HTTP-only cookie containing a session identifier. This cookie will be automatically included in subsequent requests to authenticated endpoints.

Authentication requirement is indicated for each endpoint as follows:
- 🔓 No authentication required
- 🔒 User authentication required
- 🔑 Admin authentication required

## User Routes

### Get User Profile
```
🔒 GET /api/users/profile
Response: User
```

### Update Profile
```
🔒 PUT /api/users/profile
Body: { username: string }
Response: User
```

### Get All Users (Admin Only)
```
🔑 GET /api/users
Response: User[]
```

### Get User by ID (Admin Only)
```
🔑 GET /api/users/:id
Response: User
```

### Delete User (Admin Only)
```
🔑 DELETE /api/users/:id
Response: 204 No Content
```

## Admin Routes

### Get Dashboard Stats
```
🔑 GET /api/admin/dashboard
Response: { projects: ProjectStats, sessions: SessionStats }
```

## Auth Routes

### Login
```
🔓 POST /api/auth/login
Body: { email: string, password: string }
Response: { user: { id: string, username: string, role: string }, message: string }
```

### Login Demo
```
🔓 POST /api/auth/login-demo
Body: { username: string, password: string, projectId: string }
Response: { demoUser: { id: string, username: string, role: string }, message: string }
```

### Refresh Token
```
🔒 POST /api/auth/refresh-token
Response: { message: string }
```

### Logout
```
🔒 POST /api/auth/logout
Response: { message: string }
```

## Health Routes

### Basic Health Check
```
🔓 GET /api/health
Response: { status: string }
```

### Detailed Health Check
```
🔑 GET /api/health/detailed
Response: { uptime: number, message: string, timestamp: number, database: string, emailService: string }
```

## Job Routes

### Run Job
```
🔑 POST /api/jobs/:jobName
Response: { message: string }
```

### Get Job Status
```
🔑 GET /api/jobs/:jobName/status
Response: { jobName: string, status: string }
```

## Site Settings Routes

### Get Site Settings
```
🔓 GET /api/site-settings
Response: SiteSettings
```

### Update Site Settings
```
🔑 PUT /api/site-settings
Body: { siteName: string, siteDescription: string, siteKeywords: string[], socialMediaLinks: object, logoUrl: string }
Response: SiteSettings
```

### Update SEO Settings
```
🔑 PUT /api/site-settings/seo
Body: { siteName: string, siteDescription: string, siteKeywords: string[] }
Response: SiteSettings
```

### Update Social Media Links
```
🔑 PUT /api/site-settings/social-media
Body: { socialMediaLinks: object }
Response: SiteSettings
```

### Update Logo
```
🔑 PUT /api/site-settings/logo
Body: { logoUrl: string }
Response: SiteSettings
```

## Blog Routes

### Create Blog Post
```
🔒 POST /api/blog
Body: { title: string, shortDescription: string, content: object[], tags: string[] }
Response: BlogPost
```

### Get Blog Posts
```
🔓 GET /api/blog
Query Parameters: { page?: number, limit?: number, tag?: string }
Response: { blogPosts: BlogPost[], currentPage: number, totalPages: number, totalPosts: number }
```

### Get Blog Post by ID
```
🔓 GET /api/blog/:id
Response: BlogPost
```

### Update Blog Post
```
🔒 PUT /api/blog/:id
Body: { title?: string, shortDescription?: string, content?: object[], tags?: string[] }
Response: BlogPost
```

### Delete Blog Post
```
🔒 DELETE /api/blog/:id
Response: 204 No Content
```

### Search Blog Posts
```
🔓 GET /api/blog/search
Query Parameters: { query: string }
Response: BlogPost[]
```

## Docker Session Routes

### Create Session
```
🔒 POST /api/docker-sessions
Body: { projectName: string, username: string }
Response: DockerSession
```

### Get Session
```
🔒 GET /api/docker-sessions/:sessionId
Response: DockerSession
```

### List User Sessions
```
🔒 GET /api/docker-sessions
Response: DockerSession[]
```

### Terminate Session
```
🔒 DELETE /api/docker-sessions/:sessionId
Response: { message: string }
```

### Get Session Stats
```
🔑 GET /api/docker-sessions/stats
Response: SessionStats
```

### Swap User
```
🔒 PUT /api/docker-sessions/:sessionId/swap-user
Body: { newUsername: string }
Response: DockerSession
```

## Project Routes

### Create Project
```
🔑 POST /api/projects
Body: { name: string, gitUrl: string, branch: string, dockerComposeFile: string, subdomain: string }
Response: Project
```

### Get Project by ID
```
🔒 GET /api/projects/:id
Response: Project
```

### Update Project
```
🔑 PUT /api/projects/:id
Body: { name?: string, gitUrl?: string, branch?: string, dockerComposeFile?: string, subdomain?: string }
Response: Project
```

### Delete Project
```
🔑 DELETE /api/projects/:id
Response: 204 No Content
```

### Get All Projects
```
🔒 GET /api/projects
Response: Project[]
```

### Deploy Project
```
🔑 POST /api/projects/:id/deploy
Response: { message: string }
```

### Stop Project
```
🔑 POST /api/projects/:id/stop
Response: { message: string }
```

### Freeze Project
```
🔑 POST /api/projects/:id/freeze
Response: { message: string }
```

### Unfreeze Project
```
🔑 POST /api/projects/:id/unfreeze
Response: { message: string }
```

### Get Project Stats
```
🔑 GET /api/projects/stats
Response: ProjectStats
```

## Demo User Routes

### Create Demo User
```
🔑 POST /api/demo-users
Body: { username: string, password: string, projectId: string, role: string }
Response: DemoUser
```

### Update Demo User
```
🔑 PUT /api/demo-users/:id
Body: { username?: string, password?: string, role?: string }
Response: DemoUser
```

### Delete Demo User
```
🔑 DELETE /api/demo-users/:id
Response: 204 No Content
```

### Get Demo Users for Project
```
🔑 GET /api/demo-users/:projectId
Response: DemoUser[]
```

## Account Routes

### Update Account
```
🔒 PUT /api/account
Body: { username?: string }
Response: User
```

### Change Password
```
🔒 PUT /api/account/change-password
Body: { currentPassword: string, newPassword: string }
Response: { message: string }
```

### Delete Account
```
🔒 DELETE /api/account
Response: 204 No Content
```