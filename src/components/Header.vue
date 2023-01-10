<template>
	<div id="header">
		<router-link to="/">
			<a-button type="primary"> Home </a-button>
		</router-link>
		<router-link to="/skills"><a-button type="primary"> Skills </a-button></router-link>
		<router-link to="/projects"><a-button type="primary"> Projects </a-button></router-link>
		<router-link to="/contacts"><a-button type="primary"> Contacts </a-button></router-link>
	</div>
</template>

<style scoped>
#header {
	position: absolute;
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	height: 50px;
	width: 100vw;
}
</style>
