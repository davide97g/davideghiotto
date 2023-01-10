<script setup lang="ts">
import packageJson from '../../package.json';
</script>

<template>
	<div id="footer" class="w100">
		<p id="copyright">Davide Ghiotto</p>
		<p id="version">v{{ packageJson.version }}</p>
	</div>
</template>

<style scoped>
#footer {
	position: absolute;
	height: 20px;
	margin: 0;
	padding: 0 10px;
	font-size: 12px;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
#copyright {
	text-align: left;
}
#version {
	text-align: right;
}
</style>
