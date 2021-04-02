export interface Stock {
	ISIN: string;
	PMC: number;
	change: number;
	currency: string;
	last: number;
	market: string;
	name: string;
	quantity: number;
	tick: string;
	todayPl: number;
	totalPl: number;
	unrealizedRelativePl: number;
	value: number;
}

export interface Portfolio {
	total: number;
	invested: number;
	stocks: Stock[];
	date: string;
	full_date: string;
}

export interface PerformanceMonth {
	month: string;
	year: string;
	total: number;
}
