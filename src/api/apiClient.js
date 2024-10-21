import axios from "axios";
import qs from "qs"; // Import qs to encode data

const BASE_URL = "http://localhost:9091";
const TOKEN_URL = `${BASE_URL}/api/oauth2/v1/token`;

let accessToken = "";
let refreshToken = "";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Configure Axios with the access token
const configureAxios = () => {
  if (accessToken) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  }
};

// Token management
const TokenManager = {
  // Get access token using password grant type
  async getAccessToken() {
    try {
      const response = await axios.post(
        TOKEN_URL,
        qs.stringify({
          grant_type: "password",
          client_id: "client",
          client_secret: "secret",
          username: "123",
          password: "123",
          scope: "client-internal",
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      accessToken = response.data.access_token;
      refreshToken = response.data.refresh_token;
      configureAxios();
      return accessToken;
    } catch (error) {
      console.error("Error fetching access token:", error);
      throw error;
    }
  },

  // Refresh the access token using the refresh token
  async refreshAccessToken() {
    try {
      const response = await axios.post(
        TOKEN_URL,
        qs.stringify({
          grant_type: "refresh_token",
          client_id: "client",
          client_secret: "secret",
          refresh_token: refreshToken,
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      accessToken = response.data.access_token;
      configureAxios();
      return accessToken;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      throw error;
    }
  },

  // Centralize the logic to handle token refresh
  async handleTokenRefresh(retryFunction, ...args) {
    try {
      await this.refreshAccessToken();
      return await retryFunction(...args);
    } catch (refreshError) {
      console.error("Error refreshing access token:", refreshError);
      throw refreshError;
    }
  }
};

export { axiosInstance, TokenManager };
