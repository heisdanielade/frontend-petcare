import api from "./api";
import { useMainUserStore } from "@/stores/mainUserDetails";
import { useUserStore } from "@/stores/tempUser";

export default {
  // Register user
  async register(user) {
    try {
      const response = await api.post("/auth/register", user);
      console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Redirect to login page after registration & email verification
  async loginRedirect(router) {
    const userStore = useUserStore();
    const { email, password } = userStore;
    // Check if userEmail and userPassword are available
    if (!email || !password) {
      router.push("/u/login");
    }
    const user = {
      email,
      password,
    };
    const response = await api.post("/auth/login", user);
    const token = response.data.data.token;
    localStorage.setItem("token", token); // Save token for future requests
    router.push("/u/profile");
  },

  // Verify email after registration
  async verifyEmail(user) {
    try {
      // Add a delay for UX
      await new Promise((resolve) => setTimeout(resolve, 1250));

      const response = await api.post("/auth/verify-email", user);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Resend verification email
  async resendVerificationEmail(user) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1250));

      const response = await api.post("/auth/resend-verification", user);
      console.log("Resend verification email response: ", response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Login user
  async login(user) {
    const response = await api.post("/auth/login", user);
    console.log(response);
    const token = response.data.data.token;
    console.log("\nToken:", response);
    if (token) {
      localStorage.setItem("token", token);
    }
    return response.data;
  },

  async logout() {
    const userStore = useMainUserStore();
    // Add a delay for UX
    await new Promise((resolve) => setTimeout(resolve, 750));

    userStore.clearUserDetails();
    localStorage.removeItem("token");
    window.location.href = "/";
  },
};
