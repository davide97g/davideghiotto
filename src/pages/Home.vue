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
		<h1 class="fade-in">Welcome</h1>
		<h1 class="fade-in delay-1">to my personal website</h1>
		<router-link to="#start" class="fade-in delay-2">
			<a-button type="primary">Start</a-button>
		</router-link>
	</div>
</template>

<style scoped lang="scss">
.fade-in {
	animation: fadeIn 1.5s;
	opacity: 0;
	animation-fill-mode: both;
	animation-timing-function: ease-in-out;
	&.delay-1 {
		animation-delay: 1s;
	}
	&.delay-2 {
		animation-delay: 2s;
	}
}
@keyframes fadeIn {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}
</style>
