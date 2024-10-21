import axios from "axios";
import qs from "qs"; // Import the qs library to encode data

const BASE_URL = "http://localhost:9091";

const TOKEN_URL = "http://localhost:9091/api/oauth2/v1/token";
const REFRESH_TOKEN_URL = "http://localhost:9091/api/oauth2/v1/token";

let accessToken = "";
let refreshToken = "";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Configure axios instance with the access token if available
const configureAxios = () => {
  if (accessToken) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  }
};

// Get access token using password grant type
const getAccessToken = async () => {
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
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    accessToken = response.data.access_token;
    refreshToken = response.data.refresh_token;
    configureAxios();
    console.log("Access token:", accessToken);
    return accessToken;
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw error;
  }
};

// Refresh access token using refresh token
const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      REFRESH_TOKEN_URL,
      qs.stringify({
        grant_type: "refresh_token",
        client_id: "client",
        client_secret: "secret",
        refresh_token: refreshToken,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    accessToken = response.data.access_token;
    configureAxios(); // Apply the new access token
    return accessToken;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
};

// Handle token refresh logic
const handleTokenRefresh = async (retryFunction, ...args) => {
  try {
    await refreshAccessToken();
    configureAxios();
    return await retryFunction(...args);
  } catch (refreshError) {
    console.error("Error refreshing access token:", refreshError);
    throw refreshError;
  }
};

// Get user by ID
const getUser = async (userId) => {
  configureAxios();
  try {
    const response = await axiosInstance.get(`/api/v1/user/${userId}`);
    console.log("User:", response.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      await handleTokenRefresh(getUser, userId);
    }
    console.error("Error fetching user:", error);
    throw error;
  }
};

// Create a new user
const createUser = async (userData) => {
  configureAxios();
  try {
    const response = await axiosInstance.post("/api/v1/user", userData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      await handleTokenRefresh(createUser, userData);
    }
    console.error("Error creating user:", error);
    throw error;
  }
};
// RedisController APIs
const addTicketToOrder = async (userId, addTicketRequest) => {
  configureAxios();
  try {
    const response = await axiosInstance.post(`/redis`, addTicketRequest, {
      headers: { "X-Auth-User-Id": userId },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      await handleTokenRefresh(addTicketToOrder, userId, addTicketRequest);
    }
    console.error("Error adding ticket to order:", error);
    throw error;
  }
};

const getSeatsOrdered = async (userId) => {
  configureAxios();
  try {
    const response = await axiosInstance.get(`/redis/customer`, {
      headers: { "X-Auth-User-Id": userId },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      await handleTokenRefresh(getSeatsOrdered, userId);
    }
    console.error("Error getting seats ordered:", error);
    throw error;
  }
};

const deleteTicketFromOrder = async (userId, deleteTicketRequest) => {
  configureAxios();
  try {
    const response = await axiosInstance.delete(`/redis/ticket`, {
      headers: { "X-Auth-User-Id": userId },
      data: deleteTicketRequest,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      await handleTokenRefresh(deleteTicketFromOrder, userId, deleteTicketRequest);
    }
    console.error("Error deleting ticket from order:", error);
    throw error;
  }
};

const deleteAllTicketsFromOrder = async (userId) => {
  configureAxios();
  try {
    const response = await axiosInstance.delete(`/redis/all`, {
      headers: { "X-Auth-User-Id": userId },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      await handleTokenRefresh(deleteAllTicketsFromOrder, userId);
    }
    console.error("Error deleting all tickets from order:", error);
    throw error;
  }
};

// Get all movies
const getMovies = async () => {
  configureAxios();
  try {
    const response = await axiosInstance.get(`/api/v1/movie`);
    console.log("Movies:", response.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      await handleTokenRefresh(getMovies);
    }
    console.error("Error fetching movies:", error);
    throw error;
  }
};

// Get movie by ID
const getMovieById = async (id) => {
  configureAxios();
  try {
    const response = await axiosInstance.get(`/movie/${id}`);
    console.log("Movie:", response.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      await handleTokenRefresh(getMovieById, id);
    }
    console.error("Error fetching movie:", error);
    throw error;
  }
};

// Create a new movie
const createMovie = async (movieData) => {
  configureAxios();
  try {
    const response = await axiosInstance.post(`/movie`, movieData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      await handleTokenRefresh(createMovie, movieData);
    }
    console.error("Error creating movie:", error);
    throw error;
  }
};

// Update a movie
const updateMovie = async (id, movieData) => {
  configureAxios();
  try {
    const response = await axiosInstance.put(`/movie/${id}`, movieData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      await handleTokenRefresh(updateMovie, id, movieData);
    }
    console.error("Error updating movie:", error);
    throw error;
  }
};

// Delete a movie
const deleteMovie = async (id) => {
  configureAxios();
  try {
    await axiosInstance.delete(`/movie/${id}`);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      await handleTokenRefresh(deleteMovie, id);
    }
    console.error("Error deleting movie:", error);
    throw error;
  }
};

// Get message
const getMessage = async () => {
  configureAxios();
  try {
    const response = await axiosInstance.get(`/message`);
    console.log("Message:", response.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      await handleTokenRefresh(getMessage);
    }
    console.error("Error fetching message:", error);
    throw error;
  }
};

// Get all projection rooms by movie ID
const getProjectionRoomsByMovieId = async (id) => {
  configureAxios();
  try {
    const response = await axiosInstance.get(`/projectionRoom/movie/${id}`);
    console.log("Projection Rooms:", response.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      await handleTokenRefresh(getProjectionRoomsByMovieId, id);
    }
    console.error("Error fetching projection rooms:", error);
    throw error;
  }
};

// Create a new projection room
const createProjectionRoom = async (theaterId, roomData) => {
  configureAxios();
  try {
    const response = await axiosInstance.post(`/projectionRoom/theater/${theaterId}`, roomData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      await handleTokenRefresh(createProjectionRoom, theaterId, roomData);
    }
    console.error("Error creating projection room:", error);
    throw error;
  }
};

// Create a new showtime
const createShowtime = async (showtimeData, movieId, theaterId, roomId) => {
  configureAxios();
  try {
    const response = await axiosInstance.post(`/showtime`, showtimeData, {
      params: { movie: movieId, theater: theaterId, projectionRoom: roomId },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      await handleTokenRefresh(createShowtime, showtimeData, movieId, theaterId, roomId);
    }
    console.error("Error creating showtime:", error);
    throw error;
  }
};

// Get showtimes by movie ID
const getShowtimesByMovieId = async (id) => {
  configureAxios();
  try {
    const response = await axiosInstance.get(`/showtime/movie/${id}`);
    console.log("Showtimes:", response.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      await handleTokenRefresh(getShowtimesByMovieId, id);
    }
    console.error("Error fetching showtimes:", error);
    throw error;
  }
};

// Get showtimes by room ID
const getShowtimesByRoomId = async (id) => {
  configureAxios();
  try {
    const response = await axiosInstance.get(`/showtime/room/${id}`);
    console.log("Showtimes:", response.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      await handleTokenRefresh(getShowtimesByRoomId, id);
    }
    console.error("Error fetching showtimes:", error);
    throw error;
  }
};

// Update a showtime
const updateShowtime = async (id, showtimeData) => {
  configureAxios();
  try {
    const response = await axiosInstance.put(`/showtime/${id}`, showtimeData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      await handleTokenRefresh(updateShowtime, id, showtimeData);
    }
    console.error("Error updating showtime:", error);
    throw error;
  }
};

// Create a new theater
const createTheater = async (theaterData) => {
  configureAxios();
  try {
    const response = await axiosInstance.post(`/theater`, theaterData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      await handleTokenRefresh(createTheater, theaterData);
    }
    console.error("Error creating theater:", error);
    throw error;
  }
};

export {
  getAccessToken,
  refreshAccessToken,
  getUser,
  createUser,
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getMessage,
  getProjectionRoomsByMovieId,
  createProjectionRoom,
  createShowtime,
  getShowtimesByMovieId,
  getShowtimesByRoomId,
  updateShowtime,
  createTheater,
};