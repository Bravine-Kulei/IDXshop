import axios from 'axios';

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
  private baseURL = '/admin/users';

  /**
   * Get users with filtering and pagination
   */
  async getUsers(filters: UserFilters = {}): Promise<UsersResponse> {
    try {
      const params = new URLSearchParams();
      
      // Add filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await axios.get(`${this.baseURL}?${params.toString()}`);
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
      const response = await axios.get(`/users/${userId}`);
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
      const response = await axios.patch(`${this.baseURL}/${userId}/role`, { role });
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
      const response = await axios.patch(`${this.baseURL}/${userId}/status`, { isActive });
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
      const response = await axios.patch(`${this.baseURL}/${userId}`, userData);
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
      const response = await axios.delete(`${this.baseURL}/${userId}`);
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
      const response = await axios.get(`${this.baseURL}/stats`);
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
      const response = await axios.get(`${this.baseURL}/export`, {
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
      const response = await axios.patch(`${this.baseURL}/bulk`, {
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
