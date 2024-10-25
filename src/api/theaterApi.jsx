import { axiosInstance, TokenManager, configureAxios } from "./apiClient";

const TheaterApi = {
  async createTheater(theaterData) {
    configureAxios();
    try {
      const response = await axiosInstance.post(`/api/v1/theater`, theaterData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(this.createTheater, theaterData);
      }
      console.error("Error creating theater:", error);
      throw error;
    }
  },

  async getTheaters() {
    configureAxios();
    try {
      const response = await axiosInstance.get(`/api/v1/theater`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(this.getTheaters);
      }
      console.error("Error fetching theaters:", error);
      throw error;
    }
  },

  async updateTheater(theaterId, theaterData) {
    configureAxios();
    try {
      const response = await axiosInstance.put(`/api/v1/theater/${theaterId}`, theaterData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(this.updateTheater, theaterId, theaterData);
      }
      console.error("Error updating theater:", error);
      throw error;
    }
  },

  async deleteTheater(theaterId) {
    configureAxios();
    try {
      const response = await axiosInstance.delete(`api/v1/theater/${theaterId}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(this.deleteTheater, theaterId);
      }
      console.error("Error deleting theater:", error);
      throw error;
    }
  }
};

export default TheaterApi;