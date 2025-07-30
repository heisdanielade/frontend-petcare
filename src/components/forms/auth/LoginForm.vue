<template>
  <div class="max-w-4xl md:max-w-2xl lg:max-w-2xl flex flex-col items-center justify-center mx-auto md:h-screen p-1">
    <div class="flex flex-col items-center justify-center min-h-screen w-full">
      <div
        class="w-full max-w-4xl bg-white md:h-[32.8rem] md:shadow-sm shadow-slate-300 md:rounded-xl overflow-hidden flex flex-col md:flex-row">
        <!-- Left Side: Image -->
        <div class="md:w-1/2 hidden md:block p-1">
          <img src="@/assets/images/backgrounds/cats.svg" alt="Pet Image"
            class="w-full h-full object-cover opacity-70 rounded-lg" />
        </div>

        <!-- Right Side: Login Form -->
        <div class="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <div class="w-full flex items-center justify-center">
            <router-link to="/">
              <logo />
            </router-link>
          </div>
          <p class="text-gray-500 text-center opacity-90 mt-3">
            Access your account
          </p>

          <div class="oauth flex w-full">
            <!-- Google Signin -->
            <button
              class="w-full mr-4 flex items-center justify-center gap-2 bg-white border border-gray-300 py-2 rounded-lg hover:bg-gray-200 transition text-gray-500 text-sm font-semibold mt-6">
              <img src="@/assets/images/logos/google.svg" alt="Google Icon" class="w-5 h-5" />
              Google
            </button>
            <!-- Facebook Signin -->
            <button
              class="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 py-2 rounded-lg hover:bg-gray-200 transition text-gray-500 text-sm font-semibold mt-6">
              <img src="@/assets/images/logos/facebook.svg" alt="Google Icon" class="w-5 h-5" />
              Facebook
            </button>
          </div>

          <!-- OR Separator -->
          <div class="flex items-center mt-7 mb-6">
            <div class="flex-1 h-px bg-gray-300"></div>
            <span class="px-3 text-gray-500 text-sm">or</span>
            <div class="flex-1 h-px bg-gray-300"></div>
          </div>

          <!-- Form Inputs -->
          <form @submit.prevent="handleLogin">
            <div class="relative mb-2">
              <input v-model="user.email" type="email" id="email" ref="emailInput" placeholder=" "
                class="peer w-full pt-6 border-b-2 border-gray-500 border-opacity-30 text-sm font-medium focus:outline-none focus:border-purple-700"
                :class="{ 'border-red-500': emailError }" @input="validateEmail" @focus="isEmailFocused = true"
                @blur="isEmailFocused = false" required />

              <label for="email" class="absolute left-0 transition-all text-gray-500 text-sm" :class="{
                'top-1 text-sm text-purple-700': user.email || isEmailFocused,
                'top-6 text-base text-gray-400':
                  !user.email && !isEmailFocused,
              }">
                Email Address
              </label>

              <p v-if="emailError" class="text-red-500 text-[0.825rem] mt-1">
                {{ emailError }}
              </p>
            </div>

            <!-- Password -->
            <div class="relative">
              <input v-model="user.password" :type="showPassword ? 'text' : 'password'" id="password"
                ref="passwordInput" placeholder=" "
                class="peer w-full pt-6 border-b-2 border-gray-500 border-opacity-30 text-sm font-medium focus:outline-none focus:border-purple-700"
                @focus="isPasswordFocused = true" @blur="isPasswordFocused = false" required @keydown.space.prevent />

              <label for="password" class="absolute left-0 transition-all text-gray-500 text-sm" :class="{
                'top-1 text-sm text-purple-700':
                  user.password || isPasswordFocused,
                'top-6 text-base text-gray-400':
                  !user.password && !isPasswordFocused,
              }">
                Password
              </label>

              <button type="button" @click="togglePasswordVisibility"
                class="absolute top-5 right-3 text-gray-500 hover:text-gray-700">
                <i v-if="showPassword"
                  class="fa-solid fa-eye-slash text-sm text-gray-600 opacity-30 hover:text-purple-700 transition-all"></i>
                <i v-else
                  class="fa-solid fa-eye text-sm text-gray-600 opacity-30 hover:text-purple-700 transition-all"></i>
              </button>
            </div>
            <div class="flex justify-end mt-3">
              <router-link to="/x" class="text-purple-500 text-[0.825rem] font-medium hover:underline">
                Forgot Password?
              </router-link>
            </div>

            <!-- Submit button -->
            <button type="submit"
              class="action-btn flex items-center justify-center relative left-1/2 -translate-x-1/2 w-44 mt-6 h-10 bg-dark tracking-wide text-sm text-white hover:shadow-sm transition rounded-xl hover:opacity-90 focus:outline-none"
              :disabled="!isFormValid || loading.value" :class="{
                'opacity-50 cursor-not-allowed hover:opacity-50':
                  !isFormValid || loading.value,
              }">
              <template v-if="!loading">
                <span class="font-medium text-sm">Log in</span>
                <span
                  class="bg-white color-dark text-xs ml-3 font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  <i class="transition ri-arrow-right-line"></i>
                </span>
              </template>

              <span v-else class="animate-spin text-white text-xl">
                <i class="ri-loader-4-line ri-spin"></i>
              </span>
            </button>

          </form>

          <p class="mt-5 text-gray-600 text-center text-[0.825rem]">
            Don't have an account?
            <router-link to="/u/signup" class="text-purple-500 font-medium hover:underline">
              Sign up
            </router-link>
          </p>
        </div>
      </div>

      <!-- Info -->
      <div class="xmt-6 mb-10 p-5 xflex items-center justify-center text-[0.825rem] font-normal text-gray-600">
        <div class="text-center">
          By proceeding, you accept our
          <router-link to="/legal/terms"
            class="font-medium text-purple-500 transition hover:underline hover:text-purple-700">
            Terms
          </router-link>
          and
          <router-link to="/legal/policy"
            class="font-medium text-purple-500 transition hover:underline hover:text-purple-700">
            Privacy Policy </router-link>.
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, inject } from "vue";
import { useRouter } from "vue-router";
import authService from "@/services/auth";
import userService from "@/services/user";
import { useUserStore } from "@/stores/tempUser";
import { useMainUserStore } from "@/stores/mainUserDetails";
import Logo from "@/components/reusable/Logo.vue";

const router = useRouter();
const tempUserStore = useUserStore();
const userStore = useMainUserStore();

// Reactive state
const user = ref({ email: "", password: "" });
const emailError = ref("");
const showPassword = ref(false);
const isEmailFocused = ref(false);
const isPasswordFocused = ref(false);

const loading = ref(false);
const toast = inject("toast"); // Inject global toast

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// Validation functions
const emailRegex = /^(?!.*\.\.)(?!.*\.$)(?!^\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const validateEmail = () => {
  if (!user.value.email) {
    emailError.value = "Email is required.";
  } else if (!emailRegex.test(user.value.email)) {
    emailError.value = "Invalid email address.";
  } else {
    emailError.value = "";
  }
};

// Check if form is valid
const isFormValid = computed(() => {
  return (
    user.value.email &&
    user.value.password.length >= 4 &&
    !emailError.value
  );
});

// Handle user login
const handleLogin = async () => {
  validateEmail();

  if (!isFormValid.value) return;
  loading.value = true;

  try {
    await authService.login(user.value);

    userStore.token = localStorage.getItem("token");
    // const userDetails = await userService.userDetails();
    // userStore.setUserDetails(userDetails.data);
    // userStore.isLoaded = true;

    if (toast) {
      toast.value.showToast("Login successful.", "success");
    } else {
      console.error("Toast reference is not available.");
    }
    setTimeout(() => {
      router.push("/u/profile");
    }, 1250);
  } catch (error) {
    const msg = error.response?.data?.message;

    if (msg?.includes("verify")) {
      toast?.value.showToast(msg, "error");
      tempUserStore.email = user.value.email;
      console.log("email", user.value.email);
      router.push("/u/not-verified");
      console.error("(e) Error during login:", error);
    }
    if (toast && error.response) {
      toast.value.showToast(error.response.data.message || "Login failed.", "error");
    }
  } finally {
    loading.value = false;
  }
};
</script>
