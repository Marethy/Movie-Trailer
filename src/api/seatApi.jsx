import { axiosInstance, TokenManager, configureAxios } from "./apiClient";

const SeatApi = {
  async getSeatByProjectionRoomId(id) {
    const response = await axiosInstance.get(`api/v1/seats/${id}`, {
      headers: { Authorization: undefined },
    });
    return response.data;
  },
};
export default SeatApi