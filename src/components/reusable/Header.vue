<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import authService from "@/services/auth";
import { useMainUserStore } from '@/stores/mainUserDetails';
import Logo from "@/components/reusable/Logo.vue";

const router = useRouter();
const userStore = useMainUserStore();

const user = reactive({
    email: userStore.email,
    redactedEmail: '',
    name: userStore.name,
    initial: userStore.initial,
    isLoggedIn: false,
    // To add on the backend
    hasProfileImage: false,
    hasNotifications: true,
});

user.redactedEmail = redactEmail(user.email);

function redactEmail(email) {
    if (!email || !email.includes('@')) {
        return '';
    }
    const [local, domain] = email.split('@');
    if (!domain || !domain.includes('.')) {
        return local.slice(0, 2) + '****@***';
    }
    const [domainName, ...tldParts] = domain.split('.');
    const tld = '.' + tldParts.join('.');
    const redactedLocal = local.slice(0, 2) + '****';
    const redactedDomain = '***' + tld;

    return `${redactedLocal}@${redactedDomain}`;
}



if (localStorage.getItem("token")) {
    user.isLoggedIn = true;
} else {
    user.isLoggedIn = false;
}

const isVisible = ref(false);
const toggle = () => {
    isVisible.value = !isVisible.value;
};



// handle log out
const handleLogout = () => {
    authService.logout();
};
</script>




<template>
    <header>
        <nav class="fixed z-50 top-0 w-full overflow-hidden md:px-6 py-2.5">
            <div
                class="blur-bg-2 rounded-3xl px-2 py-4 md:p-4 mx-3 md:mx-auto flex flex-wrap justify-between items-center max-w-screen-lg">
                <!-- Logo -->
                <router-link to="/">
                    <logo />
                </router-link>

                <!-- User info/login -->
                <div class="flex items-center md:order-2">

                    <!-- User avatar if user is logged in -->
                    <div v-if="user.isLoggedIn" class="flex items-center">

                        <router-link to="/u/notifications"
                            class="notifications flex items-center justify-center w-11 h-11 xbg-blue-300 text-gray-500 text-xl mr-2">
                            <i class="relative xbg-blue-500 ri-notification-badge-fill transition hover:text-gray-600">
                                <span v-if="user.hasNotifications"
                                    class="absolute w-[0.45rem] h-[0.45rem] bg-red-600 top-[0.34rem] right-[1.4px] rounded-full"></span>
                            </i>
                        </router-link>

                        <a href="/u/profile" class="relative">
                            <div
                                class="inline-flex items-center justify-center w-11 h-11 shadow-sm overflow-hidden bg-[#FEE2E2] border-[0.15rem] border-gray-100 transition-all hover:border-purple-200 rounded-full">
                                <span v-if="user.hasProfileImage" class="flex items-center justify-center">
                                    <img src="@/assets/images/others/user.webp" alt="User Profile Image"
                                        class="object-fill w-10 h-10">
                                </span>
                                <span v-else class="font-semibold text-lg md:text-xl text-[#991B1B]">
                                    {{ user.initial }}
                                </span>
                                <!-- Green signal on user image -->
                                <span
                                    class="signal hidden shadow-sm absolute top-[0.125rem] right-[0.125rem] z-20 w-3 h-3 border-[0.125rem] border-gray-200 bg-green-400 rounded-full"></span>
                            </div>
                        </a>
                    </div>

                    <!-- Login button if user is not logged in -->
                    <router-link v-else to="/u/login"
                        class="bg-dark login-btn shadow-sm text-center w-[5rem] p-2 text-sm transition text-white font-medium rounded-xl focus:outline-none">
                        Log in
                    </router-link>

                    <!-- Button to activate mobile menu -->
                    <button @click="toggle" type="button"
                        class="inline-flex lg:hidden items-center justify-center p-1 w-[2.125rem] h-[2.125rem]  ml-5 text-2xl text-gray-500 rounded-lg focus:outline-none  hover:text-gray-600 focus:text-gray-600">
                        <i class="ri-menu-4-line"></i>
                        <span class="sr-only">Open main menu</span>
                    </button>

                </div>

                <!-- Desktop menu -->
                <div class="hidden justify-between items-center w-full lg:flex md:w-auto md:order-1" id="mobile-menu-2">

                    <!-- Test logged in header links -->
                    <ul class="hidden xflex flex-col mt-4 font-medium md:flex-row md:space-x-8 md:mt-0">
                        <li>
                            <router-link to="/u/settings"
                                class="block py-2 pr-4 pl-3 text-gray-600 border-b border-gray-100 hover:text-purple-500 transition md:hover:bg-transparent md:border-0 md:hover:text-primary-700 md:p-0">Account
                                settings</router-link>
                        </li>
                        <li>
                            <router-link to="/legal/terms"
                                class="block py-2 pr-4 pl-3 text-gray-600 border-b border-gray-100 hover:text-purple-500 transition md:hover:bg-transparent md:border-0 md:hover:text-primary-700 md:p-0">
                                Support </router-link>
                        </li>
                        <li>
                            <span @click="handleLogout()"
                                class="custom-cursor block py-2 pr-4 pl-3 text-gray-600 border-b border-gray-100 hover:text-purple-500 transition md:hover:bg-transparent md:border-0 md:hover:text-primary-700 md:p-0">Sign
                                out<i class="ml-2 text-sm fa-solid fa-arrow-right-from-bracket"></i></span>
                        </li>
                    </ul>

                    <ul class="flex flex-col mt-4 font-medium md:flex-row md:space-x-8 md:mt-0">
                        <li>
                            <router-link to="/x"
                                class="block py-2 pr-4 pl-3 text-gray-600 border-b border-gray-100 hover:text-purple-500 transition md:hover:bg-transparent md:border-0 md:hover:text-primary-700 md:p-0">Adopt</router-link>
                        </li>
                        <li>
                            <router-link to="/x"
                                class="block py-2 pr-4 pl-3 text-gray-600 border-b border-gray-100 hover:text-purple-500 transition md:hover:bg-transparent md:border-0 md:hover:text-primary-700 md:p-0">Contact</router-link>
                        </li>
                        <li>
                            <router-link to="/legal/terms"
                                class="block py-2 pr-4 pl-3 text-gray-600 border-b border-gray-100 hover:text-purple-500 transition md:hover:bg-transparent md:border-0 md:hover:text-primary-700 md:p-0">
                                Legal</router-link>
                        </li>
                        <li>
                            <a href="https://github.com/heisdanielade" target="_blank"
                                class="block py-2 pr-4 pl-3 text-gray-600 border-b border-gray-100 hover:text-purple-500 transition md:hover:bg-transparent md:border-0 md:hover:text-primary-700 md:p-0">Developer</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        <!-- Mobile Navbar -->
        <Transition name="slide">
            <div v-if="isVisible"
                class="mobile-menu blur-bg-2 pt-[4.75rem] px-7 block lg:hidden fixed top-0 left-0 z-40 w-full h-[16.5rem] rounded-b-3xl">
                <ul v-if="user.isLoggedIn" class="flex flex-col mt-6 font-semibold text-sm">
                    <li v-scroll-reveal class="not-shown mb-4 w-full color-dark">
                        <div class="mobile-menu-link relative flex items-center justify-end pb-1">
                            <span class="">
                                Logged in as <span class="text-purple-500">{{ user.redactedEmail }}</span>
                            </span>
                        </div>
                    </li>

                    <li v-scroll-reveal class="not-shown mb-4 w-full color-dark hover:text-purple-500">
                        <router-link to="/u/settings"
                            class="mobile-menu-link relative flex items-center justify-end pb-1">
                            <span class="">
                                Settings
                            </span>
                            <i class="ml-2 fa-solid fa-gear"></i>
                        </router-link>
                    </li>
                    <li v-scroll-reveal class="not-shown mb-4 w-full color-dark hover:text-purple-500">
                        <router-link to="/x" class="mobile-menu-link relative flex items-center justify-end pb-1">
                            <span class="">
                                Support
                            </span>
                            <i class="ml-2 ri-customer-service-line"></i>
                        </router-link>
                    </li>
                    <li v-scroll-reveal class="not-shown relative mb-4 w-full color-dark hover:text-purple-500">
                        <div @click="handleLogout()"
                            class="mobile-menu-link w-28 absolute right-0 flex items-center justify-end pb-1">
                            <span class="">
                                Sign out
                            </span>
                            <i class="ml-2 fa-solid fa-arrow-right-from-bracket"></i>
                        </div>
                    </li>
                </ul>

                <ul v-else class="flex flex-col mt-6 font-semibold text-sm">
                    <li v-scroll-reveal class="not-shown mb-4 w-full color-dark hover:text-purple-500">
                        <router-link to="/x" class="mobile-menu-link relative flex items-center justify-end pb-1">
                            <span class="">
                                Adopt
                            </span>
                            <i class="ml-2 fa-solid fa-cat"></i>
                        </router-link>
                    </li>
                    <li v-scroll-reveal class="not-shown mb-4 w-full color-dark hover:text-purple-500">
                        <router-link to="/x" class="mobile-menu-link relative flex items-center justify-end pb-1">
                            <span class="">
                                Contact
                            </span>
                            <i class="ml-2 ri-customer-service-line"></i>
                        </router-link>
                    </li>
                    <li v-scroll-reveal class="not-shown mb-4 w-full color-dark hover:text-purple-500">
                        <a href="https://github.com/heisdanielade" target="_blank"
                            class="mobile-menu-link relative flex items-center justify-end pb-1">
                            <span class="">
                                Developer
                            </span>
                            <i class="ml-2 ri-code-s-slash-line"></i>
                        </a>
                    </li>
                    <li v-scroll-reveal class="not-shown mb-4 w-full color-dark hover:text-purple-500">
                        <router-link to="/legal/terms"
                            class="mobile-menu-link relative flex items-center justify-end pb-1">
                            <span class="">
                                Legal Docs
                            </span>
                            <i class="ml-2 ri-article-line"></i>
                        </router-link>
                    </li>
                </ul>
            </div>
        </Transition>

    </header>
</template>



<style scoped>
.login-btn:hover {
    background: #5e1381;
    background: repeating-linear-gradient(to right, #5e1381 0%, #6c1a92 50%, #9046A5 100%);
}


/* -- mobile menu -- */
.mobile-menu-link {
    transition: all 0.3s ease;
}

/* -- Mobile menu visibility animation -- */
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease-in-out;
}

.slide-enter-from {
    transform: translateY(-120%);
    opacity: 0;
}

.slide-enter-to {
    transform: translateY(0);
    opacity: 1;
}

.slide-leave-from {
    transform: translateY(0);
    opacity: 1;
}

.slide-leave-to {
    transform: translateY(-120%);
    opacity: 0;
}
</style>