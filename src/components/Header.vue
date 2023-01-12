<template>
	<div id="header">
		<div class="w100" v-if="!isMobile">
			<router-link to="/" active-class="disabled">
				<a-button type="primary"> Home </a-button>
			</router-link>
			<router-link to="/skills" active-class="disabled"
				><a-button type="primary"> Skills </a-button></router-link
			>
			<router-link to="/projects" active-class="disabled"
				><a-button type="primary"> Projects </a-button></router-link
			>
			<router-link to="/contacts" active-class="disabled"
				><a-button type="primary"> Contacts </a-button></router-link
			>
		</div>
		<div
			v-else
			style="display: flex; justify-content: flex-end; padding-right: 20px"
			class="w100"
		>
			<MenuOutlined @click="showMobileMenu = true" />
			<MobileMenu :visible="showMobileMenu" @close="showMobileMenu = false" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { MenuOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';
import { router } from '../router';
import { isMobile } from '../services/utils';
import MobileMenu from './MobileMenu.vue';

const showMobileMenu = ref(false);

router.afterEach(() => {
	showMobileMenu.value = false;
	console.info(router.currentRoute.value.name);
});
</script>

<style scoped lang="scss">
#header {
	position: absolute;
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	height: 50px;
	width: 100vw;

	a {
		padding: 5px;
	}
}

.disabled {
	pointer-events: none;
	button {
		background-color: #3f7bb3;
	}
}
</style>
