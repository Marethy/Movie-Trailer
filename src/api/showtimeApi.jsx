import { axiosInstance, TokenManager } from "./apiClient";

const ShowtimeApi = {
  async createShowtime(showtimeData, movieId, theaterId, roomId) {
    try {
      const response = await axiosInstance.post(`/showtime`, showtimeData, {
        params: { movie: movieId, theater: theaterId, projectionRoom: roomId },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(this.createShowtime, showtimeData, movieId, theaterId, roomId);
      }
      console.error("Error creating showtime:", error);
      throw error;
    }
  },

  async getShowtimesByMovieId(id) {
    try {
      const response = await axiosInstance.get(`/showtime/movie/${id}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(this.getShowtimesByMovieId, id);
      }
      console.error("Error fetching showtimes by movie ID:", error);
      throw error;
    }
  },

  async getShowtimesByRoomId(id) {
    try {
      const response = await axiosInstance.get(`/showtime/room/${id}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(this.getShowtimesByRoomId, id);
      }
      console.error("Error fetching showtimes by room ID:", error);
      throw error;
    }
  },

  async updateShowtime(id, showtimeData) {
    try {
      const response = await axiosInstance.put(`/showtime/${id}`, showtimeData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(this.updateShowtime, id, showtimeData);
      }
      console.error("Error updating showtime:", error);
      throw error;
    }
  },

  async getShowtimeFromOrder(requests) {
    try {
      const response = await axiosInstance.post(`/showtime/order`, requests);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(this.getShowtimeFromOrder, requests);
      }
      console.error("Error fetching showtime from order:", error);
      throw error;
    }
  },
};

export default ShowtimeApi;