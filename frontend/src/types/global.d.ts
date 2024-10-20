// src/types/global.d.ts

declare global {
  interface User {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'user';
    profileImage?: string;
  }

  interface BlogPost {
    id: string;
    title: string;
    shortDescription: string;
    content: BlogContent[];
    tags: string[];
    author: string;
    createdAt: string;
    updatedAt: string;
  }

  interface BlogContent {
    type: 'text' | 'code' | 'image' | 'link';
    content: string;
    language?: string;
    alt?: string;
  }

  interface Project {
    id: string;
    name: string;
    description: string;
    gitUrl: string;
    branch: string;
    dockerComposeFile: string;
    subdomain: string;
    status: 'running' | 'stopped' | 'error' | 'frozen';
    containers: Container[];
  }

  interface Container {
    name: string;
    port: number;
    type: 'frontend' | 'backend' | 'database' | 'other';
  }

  interface DemoUser {
    id: string;
    username: string;
    projectId: string;
  }

  interface DockerSession {
    id: string;
    sessionId: string;
    userId: string;
    projectName: string;
    username: string;
    containerSessionId: string;
    startTime: string;
    endTime?: string;
    status: 'active' | 'terminated';
  }

  interface SiteSettings {
    siteName: string;
    siteDescription: string;
    siteKeywords: string[];
    socialMediaLinks: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
    };
    logoUrl: string;
  }

  interface ApiResponse<T> {
    data: T;
    message?: string;
  }
}

export {};