import { axiosInstance, TokenManager } from "./apiClient";

const MovieApi = {
  async getMovies() {
    try {
      const response = await axiosInstance.get(`/movie`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(this.getMovies);
      }
      console.error("Error fetching movies:", error);
      throw error;
    }
  },

  async getMovieById(id) {
    try {
      const response = await axiosInstance.get(`/movie/${id}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(this.getMovieById, id);
      }
      console.error("Error fetching movie:", error);
      throw error;
    }
  },

  async createMovie(movieData) {
    try {
      const response = await axiosInstance.post(`/movie`, movieData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(this.createMovie, movieData);
      }
      console.error("Error creating movie:", error);
      throw error;
    }
  },

  async updateMovie(id, movieData) {
    try {
      const response = await axiosInstance.put(`/movie/${id}`, movieData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(this.updateMovie, id, movieData);
      }
      console.error("Error updating movie:", error);
      throw error;
    }
  },

  async deleteMovie(id) {
    try {
      await axiosInstance.delete(`/movie/${id}`);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(this.deleteMovie, id);
      }
      console.error("Error deleting movie:", error);
      throw error;
    }
  },

  async getMoviesByIds(ids) {
    try {
      const response = await axiosInstance.get(`/movie/ids`, { params: { ids } });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(this.getMoviesByIds, ids);
      }
      console.error("Error fetching movies by IDs:", error);
      throw error;
    }
  },

  async getMoviesByTheater(theaterId) {
    try {
      const response = await axiosInstance.get(`/movie/theater/${theaterId}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(this.getMoviesByTheater, theaterId);
      }
      console.error("Error fetching movies by theater ID:", error);
      throw error;
    }
  },

  async rateMovie(ratingData) {
    try {
      const response = await axiosInstance.put(`/movie/rating`, ratingData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(this.rateMovie, ratingData);
      }
      console.error("Error rating movie:", error);
      throw error;
    }
  },

  async searchMovies(searchText, pageNo = 0, pageSize = 10, sortBy = "id", sortDir = "asc") {
    try {
      const response = await axiosInstance.get(`/movie/search`, {
        params: { searchText, pageNo, pageSize, sortBy, sortDir },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(this.searchMovies, searchText, pageNo, pageSize, sortBy, sortDir);
      }
      console.error("Error searching movies:", error);
      throw error;
    }
  },
};

export default MovieApi;