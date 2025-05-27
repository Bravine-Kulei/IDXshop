import axios from 'axios';
import { buildAdminApiUrl, API_ENDPOINTS } from '../config/api';

// Types
export interface User {
  id: string;
  clerkId?: string;
  name: string;
  email: string;
  role: 'customer' | 'admin' | 'technician' | 'sales';
  isActive: boolean;
  lastLogin?: string;
  phone?: string;
  address?: any;
  createdAt: string;
  updatedAt: string;
}

export interface UserFilters {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface UsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  message?: string;
}

export interface UserResponse {
  success: boolean;
  data: {
    user: User;
  };
  message?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  isActive?: boolean;
}

/**
 * User Service for managing user-related API calls
 */
class UserService {
  private baseURL: string;

  constructor() {
    // Use the centralized API configuration
    this.baseURL = buildAdminApiUrl(API_ENDPOINTS.ADMIN.USERS);
  }

  /**
   * Create axios instance with authentication headers
   */
  private async createAuthenticatedRequest() {
    // Get Clerk token from window.Clerk if available
    let token = null;
    try {
      if (window.Clerk?.session) {
        token = await window.Clerk.session.getToken();
      }
    } catch (error) {
      console.warn('Failed to get Clerk token:', error);
    }

    return axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    });
  }

  /**
   * Get users with filtering and pagination
   */
  async getUsers(filters: UserFilters = {}): Promise<UsersResponse> {
    try {
      const api = await this.createAuthenticatedRequest();
      const params = new URLSearchParams();

      // Add filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await api.get(`?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching users:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  }

  /**
   * Get a single user by ID
   */
  async getUser(userId: string): Promise<UserResponse> {
    try {
      const api = await this.createAuthenticatedRequest();
      const response = await api.get(`/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching user:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
  }

  /**
   * Update user role
   */
  async updateUserRole(userId: string, role: string): Promise<{ success: boolean; message?: string }> {
    try {
      const api = await this.createAuthenticatedRequest();
      const response = await api.patch(`/${userId}/role`, { role });
      return response.data;
    } catch (error: any) {
      console.error('Error updating user role:', error);
      throw new Error(error.response?.data?.message || 'Failed to update user role');
    }
  }

  /**
   * Update user status (activate/deactivate)
   */
  async updateUserStatus(userId: string, isActive: boolean): Promise<{ success: boolean; message?: string }> {
    try {
      const api = await this.createAuthenticatedRequest();
      const response = await api.patch(`/${userId}/status`, { isActive });
      return response.data;
    } catch (error: any) {
      console.error('Error updating user status:', error);
      throw new Error(error.response?.data?.message || 'Failed to update user status');
    }
  }

  /**
   * Update user details
   */
  async updateUser(userId: string, userData: UpdateUserData): Promise<UserResponse> {
    try {
      const api = await this.createAuthenticatedRequest();
      const response = await api.patch(`/${userId}`, userData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating user:', error);
      throw new Error(error.response?.data?.message || 'Failed to update user');
    }
  }

  /**
   * Delete user (if needed in the future)
   */
  async deleteUser(userId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const api = await this.createAuthenticatedRequest();
      const response = await api.delete(`/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting user:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    usersByRole: Record<string, number>;
  }> {
    try {
      const api = await this.createAuthenticatedRequest();
      const response = await api.get('/stats');
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching user stats:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch user statistics');
    }
  }

  /**
   * Export users data
   */
  async exportUsers(format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    try {
      const api = await this.createAuthenticatedRequest();
      const response = await api.get('/export', {
        params: { format },
        responseType: 'blob'
      });
      return response.data;
    } catch (error: any) {
      console.error('Error exporting users:', error);
      throw new Error(error.response?.data?.message || 'Failed to export users');
    }
  }

  /**
   * Bulk update users
   */
  async bulkUpdateUsers(userIds: string[], updates: Partial<UpdateUserData>): Promise<{ success: boolean; message?: string }> {
    try {
      const api = await this.createAuthenticatedRequest();
      const response = await api.patch('/bulk', {
        userIds,
        updates
      });
      return response.data;
    } catch (error: any) {
      console.error('Error bulk updating users:', error);
      throw new Error(error.response?.data?.message || 'Failed to bulk update users');
    }
  }
}

// Export singleton instance
export const userService = new UserService();
export default userService;
