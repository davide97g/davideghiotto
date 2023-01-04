type ExpenseType = 'house' | 'travel' | 'health';

export interface Expense {
	date: string;
	amount: number;
	description: string;
	type: ExpenseType;
}
