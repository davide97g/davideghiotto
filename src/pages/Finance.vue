<template>
	<h1>Finance</h1>
	<div class="actions">
		<a-button type="primary" danger @click="addExpense">Add Expense</a-button>
		<a-button type="primary" @click="addEarning">Add Earning</a-button>
	</div>
</template>

<script setup lang="ts">
import { DataBaseClient } from '../api/db';
import { Earning } from '../models/earning';
import { Expense } from '../models/expense';

const addExpense = () => {
	const expense: Expense = {
		date: '01/01/2023',
		description: 'Test expense',
		amount: 1.23,
		type: 'travel',
	};
	DataBaseClient.Transactions.createNewExpense(expense)
		.then(() => console.info('expense added successfully'))
		.catch(err => console.error(err));
};
const addEarning = () => {
	const earning: Earning = {
		date: '02/01/2023',
		description: 'Test earning',
		amount: 123.45,
		type: 'salary',
	};
	DataBaseClient.Transactions.createNewEarning(earning)
		.then(() => console.info('earning added successfully'))
		.catch(err => console.error(err));
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
