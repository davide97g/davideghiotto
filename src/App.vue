<script setup lang="ts">
import Footer from './components/Footer.vue';
import { isMobile, setIsLoading } from './services/utils';

document.title = import.meta.env.VITE_APP_TITLE;
if (!import.meta.env.PROD)
	[...document.head.getElementsByTagName('link')].forEach(
		link => (link.href = link.href.replace('icons', 'icons-test'))
	);

setIsLoading(false);
</script>

<template>
	<div id="router-view" :class="{ mobile: isMobile }">
		<router-view />
	</div>
	<Footer />
</template>

<style scoped lang="scss">
#router-view {
	height: 100vh;
	overflow: auto;
	&.mobile {
		height: 100vh;
	}
}
</style>
