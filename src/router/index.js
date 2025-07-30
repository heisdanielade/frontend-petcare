import { createRouter, createWebHistory } from "vue-router";
import { isTokenValid } from "@/utils/auth";
import { pinia } from "@/stores/pinia";
import { useMainUserStore } from "@/stores/mainUserDetails.js";
import authService from "@/services/auth";
// ---------------------------------------------------------------
import HomePage from "@/components/pages/HomePage.vue";
// ---------------------------------------------------------------
import LoginPage from "@/components/pages/auth/LoginPage.vue";
import SignUpPage from "@/components/pages/auth/SignUpPage.vue";
import VerifyEmailPage from "@/components/pages/auth/VerifyEmailPage.vue";
import NotVerifiedPage from "@/components/pages/auth/NotVerifiedPage.vue";
// ---------------------------------------------------------------
import MyProfilePage from "@/components/pages/account/MyProfile.vue";
import SettingsPage from "@/components/pages/account/SettingsPage.vue";
// ---------------------------------------------------------------
import PetFormsPage from "@/components/pages/account/PetFormsPage.vue";
// ---------------------------------------------------------------
import UnderConstructionPage from "@/components/pages/UnderConstructionPage.vue";
import NotFoundPage from "@/components/pages/404Page.vue";
// ---------------------------------------------------------------
import TermsPage from "@/components/pages/legal/TermsPage.vue";
import PolicyPage from "@/components/pages/legal/PolicyPage.vue";
// ---------------------------------------------------------------

// Get userDetails if there is a logged in user
const userStore = useMainUserStore(pinia);

const routes = [
  // Base Routes
  { path: "/", name: "Home", component: HomePage, meta: { title: "Home" } },
  {
    path: "/x",
    name: "UnderConstruction",
    component: UnderConstructionPage,
    meta: { title: "Under Construction" },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: NotFoundPage,
    meta: { title: "Not Found (404)" },
  },

  // Authentication Routes
  {
    path: "/u/login",
    name: "Login",
    component: LoginPage,
    meta: { title: "Log in" },
  },

  {
    path: "/u/signup",
    name: "Signup",
    component: SignUpPage,
    meta: { title: "Create Account" },
  },

  {
    path: "/u/verify-email",
    name: "VerifyEmail",
    component: VerifyEmailPage,
    meta: { title: "Verify Email" },
  },

  {
    path: "/u/not-verified",
    name: "NotVerified",
    component: NotVerifiedPage,
    meta: { title: "Email Not Verified" },
  },

  // Legal Info Routes
  {
    path: "/legal/terms",
    name: "Terms",
    component: TermsPage,
    meta: { title: "Terms & Conditions" },
  },

  {
    path: "/legal/policy",
    name: "Policy",
    component: PolicyPage,
    meta: { title: "Privacy Policy" },
  },

  // Profile Routes
  {
    path: "/u/profile",
    name: "MyProfile",
    component: MyProfilePage,
    meta: { title: "Profile", requiresAuth: true },
  },

  {
    path: "/u/settings",
    name: "Settings",
    component: SettingsPage, // to change
    meta: { title: "Settings", requiresAuth: true },
  },

  // Pet Forms Routes
  {
    path: "/u",
    name: "PetForms",
    component: PetFormsPage,
    meta: { title: "Pet", requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const token = userStore.token || localStorage.getItem("token");
  const isValid = token && isTokenValid(token);
  console.log("isValid", isValid);
  const isLoggedIn = token && isTokenValid(token);

  // console.log(`[NAV GUARD] Navigating to: ${to.fullPath}`);

  // Fetch user details once
  if (!userStore.isLoaded && isValid) {
    try {
      const userService = await import("@/services/user");
      const userDetails = await userService.default.userDetails();
      userStore.setUserDetails(userDetails.data);
      userStore.isLoaded = true;
    } catch (error) {
      console.error("Error fetching user details:", error);
      console.log("Token is invalid or expired. Logging out...");
      authService.logout();
      return;
    }
  }

  if (!isValid) {
    console.log("Token is invalid or expired. Logging out...");
    localStorage.removeItem("token");
  }

  // Redirect if not authenticated
  if (to.meta.requiresAuth && !isValid) {
    return next("/u/login");
  }

  // Redirect if verified
  if (to.name === "NotVerified" && userStore.enabled === true) {
    return next("/u/profile");
  }

  // Redirect if already logged in
  if ((to.name === "Signup" || to.name === "Login") && isLoggedIn) {
    return next("/u/profile");
  }

  // Redirect if email is verified
  if (to.name === "VerifyEmail" && userStore.enabled === true) {
    return next("/u/profile");
  }

  // Everything is fine, proceed
  next();
});

export default router;
