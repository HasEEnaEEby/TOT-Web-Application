export type UserRole = 'admin' | 'customer' | 'restaurant';

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  isPublic?: boolean;
  requireAuth?: boolean;
  requireVerified?: boolean;
  allowedRoles?: UserRole[];
  children?: RouteConfig[];
}