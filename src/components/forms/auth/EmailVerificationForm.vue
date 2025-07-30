<template>
    <div class="max-w-4xl md:max-w-2xl lg:max-w-2xl flex flex-col items-center justify-center mx-auto md:h-screen p-1">
        <div class="flex flex-col items-center justify-center min-h-screen w-full">
            <div
                class="w-full max-w-4xl bg-white md:h-[32.8rem] md:shadow-sm shadow-slate-300 md:rounded-xl overflow-hidden flex flex-col md:flex-row">

                <!-- Left Side: Image -->
                <div class="md:w-1/2 hidden md:block p-1">
                    <img src="@/assets/images/backgrounds/cats.svg" alt="Pet Image"
                        class="w-full h-full object-cover opacity-70 rounded-lg">
                </div>

                <!-- Right Side: Login Form -->
                <div class="w-full md:w-1/2 p-8 flex flex-col justify-center">
                    <div class="w-full flex items-center justify-center">
                        <router-link to="/">
                            <logo />
                        </router-link>
                    </div>
                    <p class="text-gray-500 text-center text-sm opacity-90 mt-3">
                        We sent a verification code to <span class="font-semibold">{{ email }}</span>
                    </p>

                    <!-- OR Separator -->
                    <div class="flex items-center mt-7 mb-6">
                        <div class="flex-1 h-px bg-gray-300"></div>
                        <span class="px-3 text-gray-500 text-sm">Email verificationCode</span>
                        <div class="flex-1 h-px bg-gray-300"></div>
                    </div>

                    <!-- Form Inputs -->
                    <form @submit.prevent="handleCodeVerification">
                        <div class="relative mb-2">
                            <div class="flex items-center justify-evenly w-full gap-x-1 pt-12 md:pt-10">
                                <input v-for="(digit, index) in verificationCodeArray" :key="index" v-model="verificationCodeArray[index]"
                                    type="number"
                                    class="block w-10 h-10 text-center font-medium text-2xl bg-transparent border-b-2 border-x-transparent border-b-gray-500 border-opacity-30 focus:outline-none focus:border-purple-700 disabled:opacity-50 disabled:pointer-events-none"
                                    :id="'verificationCode-' + index" :name="'verificationCode-' + index" placeholder="⚬" min="0" max="9"
                                    @input="handleInput(index, $event)" @keydown.delete="handleDelete(index, $event)"
                                    @paste="handlePaste" ref="verificationCodeRefs" />
                            </div>


                            <label for="verificationCode-0" class="absolute top-1 left-0 transition-all text-gray-500 text-sm">
                                Enter 6-digit code
                            </label>

                        </div>


                        <!-- Need help link -->
                        <div class="flex justify-end mt-6">
                            <router-link to="/x" class="text-purple-500 text-[0.825rem] font-medium hover:underline">
                                Need help?
                            </router-link>
                        </div>

                        <!-- Submit button -->
                        <button type="submit"
                            class="action-btn flex items-center justify-center relative left-1/2 -translate-x-1/2 w-44 mt-6 h-10 bg-dark tracking-wide text-sm text-white hover:shadow-sm transition rounded-xl hover:opacity-90 focus:outline-none"
                            :disabled="!isFormValid"
                            :class="{ 'opacity-50 cursor-not-allowed hover:opacity-50': !isFormValid }">
                            <template v-if="!loading">
                                <span class="font-medium text-sm">Verify</span>
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

                        <span @click="handleClickResend"
                            :class="[
                                'font-medium',
                                canResend ? 'text-purple-500 hover:underline cursor-pointer' : 'text-gray-400 cursor-not-allowed']">
                            <template v-if="canResend">Click to </template>
                            Resend
                        </span>
                        <span v-if="!canResend">in {{ timeRemaining }} seconds</span>
                    </p>


                </div>
            </div>

            <!-- Footer Note -->
            <div class="mt-6 mb-10 p-5 text-[0.825rem] font-normal text-gray-600 text-center">
                By proceeding, you agree to our
                <router-link to="/legal/terms"
                    class="font-medium text-purple-500 hover:underline hover:text-purple-700">
                    Terms
                </router-link>
                and
                <router-link to="/legal/policy"
                    class="font-medium text-purple-500 hover:underline hover:text-purple-700">
                    Privacy Policy
                </router-link>.
            </div>
        </div>
    </div>
</template>


<style scoped>
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type=number] {
    -moz-appearance: textfield;
}
</style>




<script setup>
import { reactive, ref, computed, onMounted, inject, watch } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from '@/stores/tempUser';
import authService from "@/services/auth";
import Logo from "@/components/reusable/Logo.vue";

const userStore = useUserStore();
const router = useRouter();
const email = userStore.email;

const emailResendCode = reactive({ email: "" });
emailResendCode.email = userStore.email;

// Reactive state
const verificationCodeArray = ref(["", "", "", "", "", ""]);
const user = reactive({
    email: "",
    verification_code: computed(() => verificationCodeArray.value.join(""))
});


const verificationCodeRefs = ref([]);
const loading = ref(false);
const toast = inject("toast");


const timeRemaining = ref(0);
const canResend = ref(false);
let intervalId;

const RESEND_INTERVAL_INITIAL = 60 // first time
const RESEND_INTERVAL_COOLDOWN = 120 // after clicking


function startTimer(seconds) {
    timeRemaining.value = seconds
    canResend.value = false

    clearInterval(intervalId)
    intervalId = setInterval(() => {
        timeRemaining.value--

        if (timeRemaining.value <= 0) {
            clearInterval(intervalId)
            canResend.value = true
        }
    }, 1000)
}

function handleClickResend() {
    if (!canResend.value) return

    handleResendVerificationEmail() // your existing resend code

    const now = Date.now()
    localStorage.setItem('lastResendTime', now.toString())
    localStorage.setItem('resendCooldown', RESEND_INTERVAL_COOLDOWN.toString())

    startTimer(RESEND_INTERVAL_COOLDOWN)
}


const handleInput = (index, event) => {
    let value = event.target.value;
    if (!/^\d?$/.test(value)) {
        verificationCodeArray.value[index] = ""; // Only allow numbers
        return;
    }
    verificationCodeArray.value[index] = value;
    // Move to the next input if a digit is entered
    if (value && index < verificationCodeRefs.value.length - 1) {
        verificationCodeRefs.value[index + 1].focus();
    }
};
const handleDelete = (index, event) => {
    if (event.key === "Backspace" && !verificationCodeArray.value[index] && index > 0) {
        verificationCodeRefs.value[index - 1].focus();
    }
};
const handlePaste = (event) => {
    event.preventDefault();
    let pasteData = (event.clipboardData || window.clipboardData).getData("text");
    pasteData = pasteData.replace(/\D/g, "").slice(0, 6); // Extract only first 4 digits
    if (pasteData.length === 4) {
        verificationCodeArray.value = pasteData.split("");
        verificationCodeRefs.value[3].focus();
    }
};


const getverificationCodeValue = () => verificationCodeArray.value.join("");
defineExpose({ getverificationCodeValue });


const isFormValid = computed(() => verificationCodeArray.value.every((digit) => digit !== ""));


const handleCodeVerification = async () => {
    if (!isFormValid.value) return;
    loading.value = true;

    try {
        await authService.verifyEmail(user);
        if (toast) {
            toast.value.showToast("Verified successfully.", "success");
        }
        setTimeout(() => {
            localStorage.removeItem("lastResendTime");
            localStorage.removeItem("resendCooldown");
            userStore.clearUser();
            authService.loginRedirect(router);
        }, 1000);
    } catch (error) {
        // Handle error and show failure toast
        console.error("(e) Error during verification:", error);
        if (toast) {
            toast.value.showToast(error.response.data.message || "Verification failed.", "error");
        }
    } finally {
        loading.value = false;
    }
};


const handleResendVerificationEmail = async () => {
    try {
        await authService.resendVerificationEmail(emailResendCode);
        if (toast) {
            toast.value.showToast("Verification email sent.", "success");
        } else {
            toast.error("Process failed. Retry.");
        }
        setTimeout(() => {
            router.push("/u/verify-email");
        }, 500);
        console.log("(i) Resend verification email process (timed) triggered.");
    } catch (error) {
        console.error("(e) Error during process:", error);
        if (toast && error.response) {
            toast.value.showToast(error.response.data.message || "Process failed, Retry.", "error");
        }
    }
};




onMounted(() => {
    user.email = email;

    const now = Date.now()
    const lastResendStr = localStorage.getItem('lastResendTime')
    const cooldownStr = localStorage.getItem('resendCooldown')

    if (!lastResendStr || !cooldownStr) {
        // First visit — force 60 second timer
        localStorage.setItem('lastResendTime', now.toString())
        localStorage.setItem('resendCooldown', RESEND_INTERVAL_INITIAL.toString())
        startTimer(RESEND_INTERVAL_INITIAL)
        return
    }

    const lastResend = parseInt(lastResendStr, 10)
    const cooldown = parseInt(cooldownStr, 10)
    const elapsed = Math.floor((now - lastResend) / 1000)
    const remaining = cooldown - elapsed

    if (remaining > 0) {
        startTimer(remaining)
    } else {
        timeRemaining.value = 0
        canResend.value = true
    }
})

</script>