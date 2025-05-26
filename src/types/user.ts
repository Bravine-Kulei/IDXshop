/**
 * User role enumeration
 */
export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  TECHNICIAN = 'technician',
  SALES = 'sales'
}

/**
 * User interface
 */
export interface User {
  id: string;
  clerkId?: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: string;
  phone?: string;
  address?: UserAddress;
  createdAt: string;
  updatedAt: string;
  authProvider?: 'local' | 'clerk';
}

/**
 * User address interface
 */
export interface UserAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

/**
 * User filters for searching and filtering
 */
export interface UserFilters {
  search?: string;
  role?: UserRole | string;
  status?: 'active' | 'inactive' | string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'email' | 'createdAt' | 'lastLogin';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Pagination information
 */
export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * API response for users list
 */
export interface UsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: PaginationInfo;
  };
  message?: string;
}

/**
 * API response for single user
 */
export interface UserResponse {
  success: boolean;
  data: {
    user: User;
  };
  message?: string;
}

/**
 * Data for updating user
 */
export interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
  role?: UserRole;
  isActive?: boolean;
  address?: UserAddress;
}

/**
 * Data for creating new user
 */
export interface CreateUserData {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role?: UserRole;
  isActive?: boolean;
  address?: UserAddress;
}

/**
 * User statistics
 */
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  usersByRole: Record<UserRole, number>;
  recentSignups: number;
  lastMonthSignups: number;
}

/**
 * User activity log
 */
export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  description: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

/**
 * User session information
 */
export interface UserSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  isActive: boolean;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

/**
 * User preferences
 */
export interface UserPreferences {
  theme?: 'light' | 'dark' | 'auto';
  language?: string;
  timezone?: string;
  notifications?: {
    email?: boolean;
    sms?: boolean;
    push?: boolean;
  };
  privacy?: {
    profileVisible?: boolean;
    activityVisible?: boolean;
  };
}

/**
 * Complete user profile with all related data
 */
export interface UserProfile extends User {
  preferences?: UserPreferences;
  activities?: UserActivity[];
  sessions?: UserSession[];
  stats?: {
    ordersCount: number;
    totalSpent: number;
    lastOrderDate?: string;
  };
}

/**
 * User form data for forms
 */
export interface UserFormData {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

/**
 * User table column definition
 */
export interface UserTableColumn {
  key: keyof User | 'actions';
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (user: User) => React.ReactNode;
}

/**
 * User action types for bulk operations
 */
export enum UserAction {
  ACTIVATE = 'activate',
  DEACTIVATE = 'deactivate',
  DELETE = 'delete',
  CHANGE_ROLE = 'change_role',
  EXPORT = 'export'
}

/**
 * Bulk operation data
 */
export interface BulkUserOperation {
  action: UserAction;
  userIds: string[];
  data?: any;
}

/**
 * User search result
 */
export interface UserSearchResult {
  users: User[];
  total: number;
  query: string;
  filters: UserFilters;
}

/**
 * User role permissions
 */
export interface RolePermissions {
  role: UserRole;
  permissions: string[];
  description: string;
}

/**
 * User audit log entry
 */
export interface UserAuditLog {
  id: string;
  userId: string;
  adminId: string;
  action: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  reason?: string;
  createdAt: string;
}
