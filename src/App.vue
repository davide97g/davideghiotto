<script setup lang="ts">
import CV from './components/CV.vue';
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
	<div id="router-view" :class="{ mobile: isMobile }" class="glass">
		<router-view />
	</div>
	<CV />
	<Footer />
</template>

<style scoped lang="scss">
#router-view {
	height: calc(100vh - 70px);
	margin: 0 20px;
	padding: 10px;
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
		animation-delay: 0.5s;
	}
	&.delay-2 {
		animation-delay: 1s;
	}
	&.delay-3 {
		animation-delay: 1.5s;
	}
	&.delay-4 {
		animation-delay: 2s;
	}
	&.delay-5 {
		animation-delay: 2.5s;
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
