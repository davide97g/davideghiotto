<template>
	<a-drawer v-model:visible="visible" title="Menu" placement="right" class="glass">
		<div style="display: flex; flex-direction: column" class="h100 mobile-link-container">
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
	</a-drawer>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
	visible: boolean;
}>();

const emits = defineEmits(['close']);

const visible = ref<boolean>(props.visible);

watch(
	() => props.visible,
	bool => {
		visible.value = bool;
	}
);

watch(
	() => visible.value,
	bool => {
		if (!bool) emits('close', bool);
	}
);
</script>

<style scoped lang="scss">
.mobile-link-container > a {
	padding: 5px;
}
.disabled {
	pointer-events: none;
	button {
		background-color: #3f7bb3;
	}
}
</style>
