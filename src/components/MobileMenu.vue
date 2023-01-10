<template>
	<a-drawer v-model:visible="visible" title="Menu" placement="right">
		<div style="display: flex; flex-direction: column" class="h100 mobile-link-container">
			<router-link to="/">
				<a-button type="primary"> Home </a-button>
			</router-link>
			<router-link to="/skills"><a-button type="primary"> Skills </a-button></router-link>
			<router-link to="/projects"><a-button type="primary"> Projects </a-button></router-link>
			<router-link to="/contacts"><a-button type="primary"> Contacts </a-button></router-link>
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
</style>
