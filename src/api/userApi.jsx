import { axiosInstance, TokenManager } from "./apiClient";

const UserApi = {
  async getUser(userId) {
    try {
      const response = await axiosInstance.get(`/api/v1/user/${userId}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(this.getUser, userId);
      }
      console.error("Error fetching user:", error);
      throw error;
    }
  },

  async createUser(userData) {
    try {
      const response = await axiosInstance.post("/api/v1/user", userData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(this.createUser, userData);
      }
      console.error("Error creating user:", error);
      throw error;
    }
  }
};

export default UserApi;
