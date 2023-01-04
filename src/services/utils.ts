import { User } from 'firebase/auth';
import { computed, ref } from 'vue';
import { useUserStore } from '../stores/user';

const windowWidth = ref(window.innerWidth);
window.addEventListener('resize', () => (windowWidth.value = window.innerWidth));

const isLoading = ref(true);

export const setIsLoading = (loading: boolean) => (isLoading.value = loading);

export const loading = computed(() => isLoading.value);
export const isMobile = computed(() => windowWidth.value < 600);

export const getPhotoURL = (user: User | null) => {
	return new URL(user?.photoURL || '../assets/img/default-profile-pic.svg', import.meta.url).href;
};

export const isLoggedIn = computed(() => useUserStore().isLoggedIn);

export const Environment = import.meta.env;
