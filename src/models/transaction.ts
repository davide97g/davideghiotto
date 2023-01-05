export interface ITransaction {
	date: string;
	amount: number;
	description: string;
}

export const EarningCategories = ['salary', 'investments', 'gifts', 'refund', 'other'];
export const ExpenseCategories = ['house', 'travel', 'health', 'other'];

export type EarningCategory = typeof EarningCategories[number];
export type ExpenseCategory = typeof ExpenseCategories[number];

export interface IEarning extends ITransaction {
	category: EarningCategory;
}

export interface IExpense extends ITransaction {
	category: ExpenseCategory;
}

export class Earning implements IEarning {
	date: string;
	amount: number;
	description: string;
	category: EarningCategory;
	constructor(transaction: ITransaction, _category: string) {
		this.date = transaction.date;
		this.amount = transaction.amount;
		this.description = transaction.description;
		this.category = _category;
	}
}

export class Expense implements IExpense {
	date: string;
	amount: number;
	description: string;
	category: ExpenseCategory;
	constructor(transaction: ITransaction, _category: string) {
		this.date = transaction.date;
		this.amount = transaction.amount;
		this.description = transaction.description;
		this.category = _category;
	}
}
