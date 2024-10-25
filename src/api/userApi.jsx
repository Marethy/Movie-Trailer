import { axiosInstance, TokenManager, configureAxios } from "./apiClient";

const UserApi = {
  async getUser(userId) {
    configureAxios(); // Ensure the access token is applied

    try {
      const response = await axiosInstance.get(`/api/v1/user/${userId}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(() => this.getUser(userId));
      }
      throw error; // Log error is handled globally
    }
  },

  async createUser(userData) {
    try {
      configureAxios(); // Ensure the access token is applied
      const response = await axiosInstance.post("/api/v1/user", userData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(() => this.createUser(userData));
      }
      throw error;
    }
  },
};

export default UserApi;
