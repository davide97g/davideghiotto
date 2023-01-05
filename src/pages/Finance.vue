<template>
	<h1>Finance</h1>
	<TransactionList :title="'Expenses'" :transactions="expenses" />
	<TransactionList :title="'Earnings'" :transactions="earnings" />
	<NewTransactionPopup
		:visible="newTransactionPopupIsVisibile"
		:type="type"
		@close="newTransactionPopupIsVisibile = false"
		@ok="addTransaction"
	/>
	<div class="actions">
		<a-button type="primary" danger @click="openPopupFor('expense')">Add Expense</a-button>
		<a-button type="primary" @click="openPopupFor('earning')">Add Earning</a-button>
	</div>
</template>

<script setup lang="ts">
import NewTransactionPopup from '../components/Finance/NewTransactionPopup.vue';
import { ref } from 'vue';
import { setIsLoading } from '../services/utils';
import { DataBaseClient } from '../api/db';
import { Earning, Expense, IEarning, IExpense, ITransaction } from '../models/transaction';
import TransactionList from '../components/Finance/TransactionList.vue';

// *** transaction list

const earnings = ref<ITransaction[]>([]);
const expenses = ref<ITransaction[]>([]);

DataBaseClient.Transactions.getTransactions('earning').then(
	transactions => (earnings.value = transactions)
);
DataBaseClient.Transactions.getTransactions('expense').then(
	transactions => (expenses.value = transactions)
);

// *** add new transaction popup

const newTransactionPopupIsVisibile = ref(false);
const type = ref<'expense' | 'earning'>('earning');

const openPopupFor = (_type: 'expense' | 'earning') => {
	type.value = _type;
	newTransactionPopupIsVisibile.value = true;
};

const addExpense = (expense: IExpense) => {
	setIsLoading(true);
	DataBaseClient.Transactions.createNewExpense(expense)
		.then(() => (newTransactionPopupIsVisibile.value = false))
		.catch(err => console.error(err))
		.finally(() => setIsLoading(false));
};
const addEarning = (earning: IEarning) => {
	setIsLoading(true);
	DataBaseClient.Transactions.createNewEarning(earning)
		.then(() => (newTransactionPopupIsVisibile.value = false))
		.catch(err => console.error(err))
		.finally(() => setIsLoading(false));
};

const addTransaction = (payload: { transaction: ITransaction; category: string }) => {
	if (type.value == 'earning') {
		const earning = new Earning(payload.transaction, payload.category);
		addEarning(earning);
	} else {
		const expense = new Expense(payload.transaction, payload.category);
		addExpense(expense);
	}
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
