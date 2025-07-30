import api from "./api";
import { useUserStore } from '@/stores/tempUser';



export default {
  // Get user details
  async userDetails() {
    try {
        const token = localStorage.getItem("token");
        const response = await api.get("/user", token);
        return response.data;
    } catch (error) {
        throw error;
    }
  },


};
