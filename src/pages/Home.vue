<template>
	<div
		style="
			display: flex;
			flex-direction: column;
			height: 100vh;
			align-items: center;
			justify-content: center;
		"
	>
		<h1>Home</h1>
		<router-link to="/finance">
			<a-button type="primary">Go To Finance</a-button>
		</router-link>
	</div>
</template>
