<script setup lang="ts">
import packageJson from '../../package.json';
</script>

<template>
	<p id="copyright">Davide Ghiotto</p>
	<p id="version">v{{ packageJson.version }}</p>
</template>

<style scoped>
#copyright {
	margin: 0;
	position: absolute;
	bottom: 10px;
	left: 10px;
	text-align: left;
	font-size: 12px;
}
#version {
	margin: 0;
	position: absolute;
	bottom: 10px;
	right: 10px;
	text-align: right;
	font-size: 12px;
}
</style>
