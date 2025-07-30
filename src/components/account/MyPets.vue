<script setup>
import { onMounted, computed, ref } from "vue";
import petService from "@/services/pet";

const pets = ref([]);
const previewPets = computed(() => pets.value.slice(0, 5));


const getAllPets = async () => {
  try {
    const allPets = await petService.allPets();
    pets.value = allPets.data.pets;
  } catch (error) {
    console.error("(e) Error retrieving logged in user pet details", error);
  }
};

onMounted(() => {
  getAllPets();
});

const placeholderImage = '/src/assets/images/others/pet-placeholder.png';

function onImageError(event) {
  event.target.src = placeholderImage;
}

const cardColors = [
  'bg-purple-300/30 hover:bg-purple-300/40',
  'bg-pink-300/30 hover:bg-pink-300/40',
  'bg-yellow-300/30 hover:bg-yellow-300/40',
  'bg-green-300/30 hover:bg-green-300/40'
];
</script>

<template>

  <section id="myPets"
    class="w-full flex flex-col items-start overflow-hidden px-5 mt-8 md:mt-0 md:p-3 mb-0 md:max-w-screen-md md:mx-auto lg:mx-auto lg:max-w-screen-lg">

    <!-- Header -->
    <div class="w-full flex items-center justify-between mb-4">
      <h2 class="text-2xl font-medium text-zinc-800">My Pets</h2>
      <router-link v-if="pets.length > 2" to="/x" class="text-sm font-semibold color-dark opacity-90 hover:opacity-65 transition-all">
        <span>View all</span>
        <i class="ri-arrow-right-line ml-2 text-xs font-extrabold"></i>
      </router-link>
    </div>

    <!-- Pets -->
    <div v-if="previewPets.length > 0" v-scroll-reveal
      class="not-shown pet-card-container w-full overflow-x-auto px-1 md:py-2 no-scrollbar h-52">
      <div class="flex gap-5 md:gap-6 h-full">
        <!-- Card -->
      <router-link to="/x" v-for="(pet, index) in previewPets" :key="pet.id"
        :class="['pet-card inline-block min-w-[12rem] max-w-[14rem] md:min-w-[14rem] md:max-w-[16rem] h-48', cardColors[index % cardColors.length], 'flex flex-shrink-0 flex-col items-center text-center p-4 rounded-2xl border border-white/30 backdrop-blur-md transition-all hover:backdrop-blur-lg md:hover:scale-105']">
        <img :src="pet.profileImageURL || placeholderImage" :alt="pet.name" @error="onImageError"
        class="w-20 h-20 rounded-full object-cover mb-4 shadow-sm border-2 border-white" 
        :class="{ 'opacity-50': !pet.profileImageURL }"/>
        <h3 class="text-base font-semibold text-zinc-800">{{ pet.name }}</h3>
        <p class="text-[0.835rem] text-zinc-700">{{ pet.breed }} ({{ pet.species }})</p>
        <p class="text-xs text-zinc-600 mt-0.5">{{ pet.sex.charAt(0) + pet.sex.slice(1).toLowerCase() }}</p>
      </router-link>
      </div>
    </div>

    <div v-else v-scroll-reveal
      class="not-shown w-full flex flex-col items-center justify-center text-center h-28 bg-white/30 rounded-2xl border border-white/30 backdrop-blur-md shadow-inner">
      <i class="text-zinc-500 text-xl fa-solid fa-dog"></i>
      <p class="text-zinc-600 text-sm mt-2">No pets yet.</p>
    </div>

  </section>

</template>



<style scoped>
/* Hide scrollbar on all browsers */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>