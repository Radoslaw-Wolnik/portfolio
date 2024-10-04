# Data Models

This document outlines the data models used in the Small Shop application.

## Table of Contents
1. [User](#user)
2. [BlogPost](#blogpost)
3. [DockerSession](#dockersession)
4. [SiteSettings](#sitesettings)

---

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

### Indexes

- `username`: Unique index

### Example

```javascript
{
  _id: ObjectId("5f8d0f3c1234567890abcdef"),
  username: "johndoe",
  password: "$2b$10$X9rLu1Uf2/bhVvNp7u.cTu5CL9t3CK6jEqHvFZL2RAzO2zFSxEF9e",
  role: "admin",
  createdAt: ISODate("2023-05-20T10:30:00Z"),
  updatedAt: ISODate("2023-05-20T10:30:00Z")
}
```

---

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
| createdAt        | Date     | Timestamp of post creation     | Auto-generated |
| updatedAt        | Date     | Timestamp of last update       | Auto-updated |

#### Content Block Schema

| Field    | Type   | Description                       | Constraints            |
|----------|--------|-----------------------------------|-----------------------|
| type     | String | Type of content block             | Enum: ['text', 'code', 'image', 'link'] |
| content  | String | Content of the block              | Required              |
| language | String | Programming language (for code)   | Optional              |
| alt      | String | Alt text (for images)             | Optional              |

### Indexes

- `tags`: Index for faster querying by tags

### Example

```javascript
{
  _id: ObjectId("5f8d0f3c1234567890abcdef"),
  title: "Introduction to Node.js",
  shortDescription: "A beginner's guide to Node.js",
  content: [
    { type: "text", content: "Node.js is a JavaScript runtime..." },
    { type: "code", content: "console.log('Hello, World!');", language: "javascript" },
    { type: "image", content: "/uploads/nodejs-logo.png", alt: "Node.js Logo" }
  ],
  tags: ["nodejs", "javascript", "backend"],
  createdAt: ISODate("2023-05-20T14:30:00Z"),
  updatedAt: ISODate("2023-05-20T14:30:00Z")
}
```

---

## DockerSession

Represents a Docker session for project demonstrations.

### Schema

| Field        | Type     | Description                         | Constraints    |
|--------------|----------|-------------------------------------|----------------|
| _id          | ObjectId | Unique identifier                   | Auto-generated |
| projectName  | String   | Name of the project                 | Required       |
| containerId  | String   | ID of the Docker container          | Required       |
| activeUsers  | Array    | List of active users in the session | Required       |
| ipAddress    | String   | IP address of the container         | Required       |
| startTime    | Date     | Start time of the session           | Required       |
| endTime      | Date     | End time of the session             | Optional       |
| revokedTokens| Array    | List of revoked tokens              | Optional       |

#### ActiveUser Schema

| Field    | Type     | Description                  | Constraints    |
|----------|----------|------------------------------|----------------|
| userId   | ObjectId | ID of the user               | Required       |
| username | String   | Username of the user         | Required       |
| role     | String   | Role of the user in the demo | Required       |

#### RevokedToken Schema

| Field     | Type   | Description                   | Constraints    |
|-----------|--------|-------------------------------|----------------|
| token     | String | The revoked token             | Required       |
| expiresAt | Date   | Expiration time of the token  | Required       |

### Indexes

- `projectName`: Index for faster querying by project name
- `containerId`: Index for faster querying by container ID

### Example

```javascript
{
  _id: ObjectId("5f8d0f3c1234567890abcdef"),
  projectName: "awesome-project",
  containerId: "abc123def456",
  activeUsers: [
    { userId: ObjectId("5f8d0f3c1234567890abcde1"), username: "alice", role: "admin" },
    { userId: ObjectId("5f8d0f3c1234567890abcde2"), username: "bob", role: "user" }
  ],
  ipAddress: "172.17.0.2",
  startTime: ISODate("2023-05-20T09:00:00Z"),
  endTime: null,
  revokedTokens: [
    { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", expiresAt: ISODate("2023-05-20T10:00:00Z") }
  ]
}
```

---

## SiteSettings

Represents the global settings for the site.

### Schema

| Field            | Type   | Description                     | Constraints    |
|------------------|--------|---------------------------------|----------------|
| _id              | ObjectId | Unique identifier             | Auto-generated |
| siteName         | String | Name of the site                | Required       |
| siteDescription  | String | Description of the site         | Required       |
| siteKeywords     | [String] | Keywords for SEO              | Optional       |
| socialMediaLinks | Object | Social media profile links      | Optional       |
| logoUrl          | String | URL of the site logo            | Optional       |

### Example

```javascript
{
  _id: ObjectId("5f8d0f3c1234567890abcdef"),
  siteName: "Small Shop",
  siteDescription: "Your one-stop shop for all things small",
  siteKeywords: ["shop", "small business", "e-commerce"],
  socialMediaLinks: {
    facebook: "https://facebook.com/smallshop",
    twitter: "https://twitter.com/smallshop",
    instagram: "https://instagram.com/smallshop"
  },
  logoUrl: "/uploads/logo.png"
}
```