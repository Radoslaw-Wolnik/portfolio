// src/types/api.d.ts
declare module '@types/api' {
    export interface User {
      id: string;
      username: string;
      email: string;
      role: 'admin' | 'user';
      profileImage?: string;
    }
  
    export interface BlogPost {
      id: string;
      title: string;
      content: BlogContent[];
      author: User;
      createdAt: string;
      updatedAt: string;
    }
  
    export interface BlogContent {
      type: 'text' | 'code' | 'image';
      content: string;
      language?: string;
    }
  
    export interface Project {
      id: string;
      name: string;
      description: string;
      gitUrl: string;
      status: 'active' | 'inactive' | 'frozen';
    }
  
    export interface DemoUser {
      id: string;
      username: string;
      projectId: string;
    }
  
    // Add more types as needed
}
  