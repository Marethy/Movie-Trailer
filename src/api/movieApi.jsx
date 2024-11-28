import { axiosInstance, TokenManager, configureAxios } from "./apiClient";

const MovieApi = {
  async getMovies() {
    {
      const response = await axiosInstance.get(`/api/v1/movie`, {
        headers: { Authorization: undefined }, 
      });
      return response.data;
    }
  },

  async getMovieById(id) {
    {
      const response = await axiosInstance.get(`/api/v1/movie/${id}`, {
        headers: { Authorization: undefined },
      });
      return response.data;
    }
  },

  async createMovie(movieData) {
    configureAxios();
    try {
      const response = await axiosInstance.post(`/api/v1/movie`, movieData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(
          this.createMovie,
          movieData
        );
      }
      console.error("Error creating movie:", error);
      throw error;
    }
  },

  async updateMovie(id, movieData) {
    configureAxios();
    try {
      const response = await axiosInstance.put(
        `/api/v1/movie/${id}`,
        movieData
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(
          this.updateMovie,
          id,
          movieData
        );
      }
      console.error("Error updating movie:", error);
      throw error;
    }
  },

  async deleteMovie(id) {
    configureAxios();
    try {
      await axiosInstance.delete(`/api/v1/movie/${id}`);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(this.deleteMovie, id);
      }
      console.error("Error deleting movie:", error);
      throw error;
    }
  },

  async getMoviesByIds(ids) {
    {
      const response = await axiosInstance.get(
        `/api/v1/movie/ids`,
        { params: { ids } },
        { headers: { Authorization: undefined } }
      );
      return response.data;
    }
  },

  async getMoviesByTheater(theaterId) {
    {
      const response = await axiosInstance.get(
        `/api/v1/movie/theater/${theaterId}`,
        { headers: { Authorization: undefined } }
      );
      return response.data;
    }
  },

  async rateMovie(ratingData) {
    configureAxios();
    try {
      const response = await axiosInstance.put(
        `/api/v1/movie/rating`,
        ratingData
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(
          this.rateMovie,
          ratingData
        );
      }
      console.error("Error rating movie:", error);
      throw error;
    }
  },

  async searchMovies(
    searchText,
    pageNo = 0,
    pageSize = 10,
    sortBy = "id",
    sortDir = "asc"
  ) {
    configureAxios();
    try {
      const response = await axiosInstance.get(`/api/v1/movie/search`, {
        params: { searchText, pageNo, pageSize, sortBy, sortDir },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(
          this.searchMovies,
          searchText,
          pageNo,
          pageSize,
          sortBy,
          sortDir
        );
      }
      console.error("Error searching movies:", error);
      throw error;
    }
  },
};

export default MovieApi;
