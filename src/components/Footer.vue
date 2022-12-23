<script setup lang="ts">
import packageJson from '../../package.json';
</script>

<template>
	<p id="version">Version {{ packageJson.version }}</p>
</template>

<style scoped>
#version {
	margin: 0;
	position: absolute;
	bottom: 10px;
	right: 10px;
	text-align: right;
}
</style>
