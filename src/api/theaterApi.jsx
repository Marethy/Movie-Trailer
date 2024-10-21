import { axiosInstance, TokenManager } from "./apiClient";

const TheaterApi = {
  async createTheater(theaterData) {
    try {
      const response = await axiosInstance.post(`/theater`, theaterData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(this.createTheater, theaterData);
      }
      console.error("Error creating theater:", error);
      throw error;
    }
  },
};

export default TheaterApi;