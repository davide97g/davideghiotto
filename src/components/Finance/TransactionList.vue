<template>
	<h2>{{ title }}</h2>
	<div class="transaction-list">
		<div class="transaction" v-for="transaction in transactions" :key="transaction.date">
			<p>
				{{ transaction.date }}
			</p>
			<p>
				{{ transaction.description }}
			</p>
			<p>
				{{ transaction.amount }}
			</p>
			<p>
				{{ transaction.category }}
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ITransaction } from '../../models/transaction';

const props = defineProps<{
	title: string;
	transactions: ITransaction[];
}>();

const transactions = computed(() => props.transactions);
</script>

<style scoped lang="scss">
.transaction-list {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 90vw;
	height: 300px;
}
</style>
