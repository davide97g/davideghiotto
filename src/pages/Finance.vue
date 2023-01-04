<template>
	<h1>Finance</h1>
	<div class="actions">
		<a-button type="primary" danger @click="addExpense">Add Expense</a-button>
		<a-button type="primary" @click="addEarning">Add Earning</a-button>
	</div>
</template>

<script setup lang="ts">
const addExpense = () => {
	console.info('add expense');
};
const addEarning = () => {
	console.info('add earning');
};
</script>

<style scoped lang="scss">
.actions {
	position: absolute;
	bottom: 0px;
	height: 75px;
	width: 100vw;
	display: flex;
	justify-content: space-around;
	align-items: center;
}
</style>
