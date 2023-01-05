<template>
	<a-list
		item-layout="horizontal"
		:data-source="transactions"
		size="medium"
		class="transaction-list"
	>
		<template #renderItem="{ item }">
			<a-list-item>
				<a-row style="width: 90vw">
					<a-col :span="8">
						{{ item.date }}
					</a-col>
					<a-col :span="16" class="left ellipsis">
						{{ item.description }}
					</a-col>
				</a-row>
				<a-row style="width: 90vw">
					<a-col :span="8">
						<a-tag :color="getCategoryColor(item.category)">{{ item.category }}</a-tag>
					</a-col>
					<a-col :span="8" class="left ellipsis"> {{ item.amount }} </a-col
					><a-col :span="8" @click="deleteTransaction(item)">
						<DeleteOutlined />
					</a-col>
				</a-row>
			</a-list-item>
		</template>
	</a-list>
</template>

<script setup lang="ts">
import DeleteOutlined from '@ant-design/icons-vue/lib/icons/DeleteOutlined';
import { computed } from 'vue';
import { ITransaction } from '../../models/transaction';
import { getCategoryColor } from '../../services/utils';

const props = defineProps<{
	title: string;
	transactions: ITransaction[];
}>();

const transactions = computed(() => props.transactions);

const deleteTransaction = (transaction: ITransaction) => {
	console.info(transaction);
};
</script>

<style scoped lang="scss">
.transaction-list {
	width: 90vw;
	max-height: 400px;
	overflow: auto;
}
</style>
