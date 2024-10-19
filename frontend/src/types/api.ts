// api/types.ts
export interface User {
    id: string;
    username: string;
    role: 'admin' | 'user';
  }
  
  export interface DemoUser {
    id: string;
    username: string;
    role: string;
  }
  
  export interface BlogPost {
    id: string;
    title: string;
    shortDescription: string;
    content: Array<{
      type: 'text' | 'code' | 'image' | 'link';
      content: string;
      language?: string;
      alt?: string;
    }>;
    tags: string[];
    author: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Project {
    id: string;
    name: string;
    gitUrl: string;
    branch: string;
    dockerComposeFile: string;
    subdomain: string;
    status: 'running' | 'stopped' | 'error' | 'frozen';
    containers: Array<{
      name: string;
      port: number;
      type: 'frontend' | 'backend' | 'database' | 'other';
    }>;
  }
  
  export interface DockerSession {
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
  
  export interface SiteSettings {
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
  
  export interface ApiResponse<T> {
    data: T;
    message?: string;
  }
  