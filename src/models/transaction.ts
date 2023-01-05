export interface ITransaction {
	date: string;
	amount: number;
	description: string;
	category: string;
	type: 'expense' | 'earning';
}

export const EarningCategories = ['salary', 'investments', 'gifts', 'refund', 'other'];
export const ExpenseCategories = ['house', 'travel', 'health', 'other'];
