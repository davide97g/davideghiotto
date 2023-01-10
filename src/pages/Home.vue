<template>
	<div
		class="h100"
		style="display: flex; flex-direction: column; align-items: center; justify-content: center"
	>
		<h2 class="fade-in">Welcome to my personal website</h2>
		<h3 class="fade-in delay-1">Let's get to know each other.</h3>
		<a-button ghost type="primary" @click="isCVHighlighted = !isCVHighlighted"
			>"I just need the CV"</a-button
		>
	</div>
</template>

<script setup lang="ts">
import { isCVHighlighted } from '../services/utils';
</script>
