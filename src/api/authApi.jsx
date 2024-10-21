import { axiosInstance, TokenManager } from "./apiClient";

const AuthApi = {
  async login(credentials) {
    try {
      const response = await axiosInstance.post(`/auth/login`, credentials);
      return response.data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  },

  async register(userData) {
    try {
      const response = await axiosInstance.post(`/auth/register`, userData);
      return response.data;
    } catch (error) {
      console.error("Error registering:", error);
      throw error;
    }
  },

  async refreshToken() {
    try {
      const response = await TokenManager.refreshAccessToken();
      return response;
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  },
};

export default AuthApi;