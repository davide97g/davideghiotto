<script setup lang="ts">
import Footer from './components/Footer.vue';
import Header from './components/Header.vue';
import { isMobile, setIsLoading } from './services/utils';

document.title = import.meta.env.VITE_APP_TITLE;
if (!import.meta.env.PROD)
	[...document.head.getElementsByTagName('link')].forEach(
		link => (link.href = link.href.replace('icons', 'icons-test'))
	);
setIsLoading(false);
</script>

<template>
	<Header />
	<div id="router-view" :class="{ mobile: isMobile }">
		<router-view />
	</div>
	<Footer />
</template>

<style scoped lang="scss">
#router-view {
	height: calc(100vh - 70px);
	margin-top: 50px;
	overflow: auto;
	// &.mobile {
	// }
}
</style>

<style lang="scss">
.fade-in {
	animation: fadeIn 1.5s;
	opacity: 0;
	animation-fill-mode: both;
	animation-timing-function: ease-in-out;
	&.delay-1 {
		animation-delay: 1s;
	}
	&.delay-2 {
		animation-delay: 2s;
	}
}
@keyframes fadeIn {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}
</style>
