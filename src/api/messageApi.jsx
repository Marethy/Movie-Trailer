import { axiosInstance, TokenManager } from "./apiClient";

const MessageApi = {
  async getMessage() {
    try {
      const response = await axiosInstance.get(`/message`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(this.getMessage);
      }
      console.error("Error fetching message:", error);
      throw error;
    }
  },
};

export default MessageApi;