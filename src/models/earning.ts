type EarningType = 'salary' | 'investments' | 'gifts' | 'refund';

export interface Earning {
	date: string;
	amount: number;
	description: string;
	type: EarningType;
}
