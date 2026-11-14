export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  profileImageUrl?: string;
  region?: string;
  bio?: string;
  publishedRecipesCount: number;
}
