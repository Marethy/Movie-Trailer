import { axiosInstance, TokenManager, configureAxios } from "./apiClient";


const UserApi = {
  async getUser(userId) {
    configureAxios();

      const response = await axiosInstance.get(`/api/v1/user/${userId}`);
      return response.data;

  },
  async getAllUser()
  {
    configureAxios();
    const response = await axiosInstance.get(`/api/v1/user/all`);
    console.log(response.data);
    return response.data;

  },

  // Override any Authorization header for this request
  async createUser(userData) {
    const response = await axiosInstance.post("/api/v1/user", userData, {
      headers: { Authorization: undefined }, // Remove Authorization header
    });
    return response.data;
  },
};

export default UserApi;
