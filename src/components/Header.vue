<template>
	<div id="header">
		<div class="w100" v-if="!isMobile">
			<router-link to="/">
				<a-button type="primary"> Home </a-button>
			</router-link>
			<router-link to="/skills"><a-button type="primary"> Skills </a-button></router-link>
			<router-link to="/projects"><a-button type="primary"> Projects </a-button></router-link>
			<router-link to="/contacts"><a-button type="primary"> Contacts </a-button></router-link>
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
import { isMobile } from '../services/utils';
import MobileMenu from './MobileMenu.vue';

const showMobileMenu = ref(false);
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
</style>
