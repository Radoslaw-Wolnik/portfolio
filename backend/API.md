# Small Shop API Documentation

## Table of Contents
1. [Authentication](#authentication)
2. [User Routes](#user-routes)
3. [Auth Routes](#auth-routes)
4. [Blog Routes](#blog-routes)
5. [Health Routes](#health-routes)
6. [Site Settings Routes](#site-settings-routes)
7. [Job Routes](#job-routes)
8. [Project Demo Routes](#project-demo-routes)

## Authentication

Most endpoints require authentication. Authentication is handled using HTTP-only cookies. When a user logs in successfully, the server will set a secure, HTTP-only cookie containing a session identifier. This cookie will be automatically included in subsequent requests to authenticated endpoints. Authentication requirement is indicated for each endpoint as follows:
 
 - 🔓 No authentication required
 - 🔒 User authentication required
 - 🔑 Admin authentication required

## User Routes

#### Get User's Own Profile
```
🔒 GET /api/users/me
Response: User
```

#### Update Profile
```
🔒 PUT /api/users/profile
Body: { username: string }
Response: User
```

## Auth Routes

#### Login
```
🔓 POST /api/auth/login
Body: { username: string, password: string }
Response: { message: "Login successful", user: { id: string, role: string } }
```

#### Logout
```
🔒 POST /api/auth/logout
Response: { message: "Logout successful" }
```

#### Change Password
```
🔒 PUT /api/auth/change-password
Body: { currentPassword: string, newPassword: string }
Response: { message: "Password changed successfully" }
```

## Blog Routes

#### Get Blog Posts
```
🔓 GET /api/blog
Query Parameters: { page?: number, limit?: number, tag?: string }
Response: { blogPosts: [BlogPost], currentPage: number, totalPages: number, total: number }
```

#### Get Blog Post by ID
```
🔓 GET /api/blog/:id
Response: BlogPost
```

#### Create Blog Post
```
🔑 POST /api/blog
Body: { title: string, shortDescription: string, content: [{ type: string, content: string, language?: string, alt?: string }], tags: [string] }
Response: BlogPost
```

#### Update Blog Post
```
🔑 PUT /api/blog/:id
Body: { title?: string, shortDescription?: string, content?: [{ type: string, content: string, language?: string, alt?: string }], tags?: [string] }
Response: BlogPost
```

#### Delete Blog Post
```
🔑 DELETE /api/blog/:id
Response: { message: "Blog post deleted successfully" }
```

## Health Routes

#### Basic Health Check
```
🔓 GET /api/health/basic
Response: { status: "OK" }
```

#### Detailed Health Check
```
🔓 GET /api/health/details
Response: { 
  uptime: number,
  message: string,
  timestamp: number,
  database: string
}
```

## Site Settings Routes

#### Get Site Settings
```
🔓 GET /api/site-settings
Response: SiteSettings
```

#### Update Site Settings
```
🔑 PUT /api/site-settings
Body: { siteName?: string, siteDescription?: string, siteKeywords?: [string], socialMediaLinks?: object, logoUrl?: string }
Response: SiteSettings
```

## Job Routes

#### Run Job
```
🔑 POST /api/jobs/:jobName
Response: { message: "Job completed successfully" }
```

#### Get Job Status
```
🔑 GET /api/jobs/:jobName/status
Response: { /* Job status details */ }
```

## Project Demo Routes

For detailed information about project demo management, Docker services, and image prebuilding, please refer to the [Project Management and Docker Services Documentation](./project-management-docker-services.md).