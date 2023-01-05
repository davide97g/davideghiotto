<template>
	<a-modal
		v-model:visible="visible"
		:title="'New ' + type"
		@cancel="emits('close')"
		:loading="loading"
		:disabled="true"
	>
		<div class="input-form">
			<a-input
				type="date"
				v-model:value="transaction.date"
				placeholder="Choose a date"
				style="margin-top: 10px"
			></a-input>
			<a-input
				type="text"
				v-model:value="transaction.description"
				placeholder="Enter a description"
				style="margin-top: 10px"
			></a-input>
			<a-input-number
				v-model:value="transaction.amount"
				placeholder="Enter an amount"
				:min="0"
				:precision="2"
				style="margin-top: 10px"
			></a-input-number>
			<a-select
				ref="select"
				v-model:value="categoryExpense"
				v-if="type == 'expense'"
				style="margin-top: 10px"
			>
				<a-select-option
					v-for="category in ExpenseCategories"
					:key="category"
					:value="category"
					>{{ category }}</a-select-option
				>
			</a-select>
			<a-select ref="select" v-model:value="categoryEarning" v-else style="margin-top: 10px">
				<a-select-option
					v-for="category in EarningCategories"
					:key="category"
					:value="category"
					>{{ category }}</a-select-option
				>
			</a-select>
		</div>
		<template #footer>
			<a-button key="back" @click="emits('close')">Return</a-button>
			<a-button
				key="submit"
				type="primary"
				:loading="loading"
				@click="handleOk"
				:disabled="!transaction.amount || !transaction.date || !transaction.description"
				>Create</a-button
			>
		</template>
	</a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import {
	ExpenseCategory,
	EarningCategory,
	ITransaction,
	EarningCategories,
	ExpenseCategories,
} from '../../models/transaction';
import { formatDate, loading } from '../../services/utils';

const props = defineProps<{
	visible: boolean;
	type: 'expense' | 'earning';
}>();

const emits = defineEmits(['close', 'ok']);

const visible = ref<boolean>(false);

const categoryExpense = ref<ExpenseCategory>('other');
const categoryEarning = ref<EarningCategory>('other');

watch(
	() => props.visible,
	() => (visible.value = props.visible)
);

const transaction = ref<ITransaction>({
	description: '',
	date: formatDate(new Date().toLocaleDateString()),
	amount: 0,
	category: '',
});

const handleOk = () => {
	emits('ok', {
		transaction: transaction.value,
		category: props.type == 'expense' ? categoryExpense.value : categoryEarning.value,
	});
};
</script>

<style lang="scss" scoped>
.input-form {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
}
</style>
