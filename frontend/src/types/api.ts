// src/types/api.ts

// We don't need to redeclare types that are already in global.d.ts
// This file can be used for API-specific types or extensions

// Example of an API-specific type:
export interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

// Example of extending a global type for API use:
export interface UserWithToken extends User {
  token: string;
}

// If there are any other API-specific types, they can be added here