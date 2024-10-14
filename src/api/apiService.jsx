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
        username: "khiem",
        password: "hello",
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
const getUser2 = async (userId) => {
  configureAxios();
  try {
    const response = await axiosInstance.get(`/user/${userId}`);
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
    const response = await axiosInstance.post("/user", userData); // Directly sending JSON
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      await handleTokenRefresh(createUser, userData);
    }
    console.error("Error creating user:", error);
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

export { getAccessToken, refreshAccessToken, getUser, createUser, getMovies,getUser2 };
