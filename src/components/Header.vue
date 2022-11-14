<script setup lang="ts"></script>

<template>
	<nav class="main-navbar">
		<router-link id="logo" to="/">
			<img src="../assets/img/logo.png" alt="Personal Logo" width="50" height="50" />
		</router-link>
		<router-link to="/about">About Me</router-link>
		<router-link to="/education">Education</router-link>
		<router-link to="/experience">Experience</router-link>
		<router-link to="/contacts">Contact me</router-link>
	</nav>
</template>

<style scoped lang="scss">
.main-navbar {
	width: 450px;
	height: 100px;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
#logo {
	margin-left: 25px;
}
</style>
