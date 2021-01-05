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
	stocks: Stock[];
	date: string;
	full_date: string;
}

export interface PerformanceMonth {
	month: string;
	year: string;
	total: number;
}

let labels = ['JUN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
let data = [80, 160, 200, 160, 250, 280, 220, 190, 200, 250, 290, 320];

let pMs: PerformanceMonth[] = [];
for (let i = 0; i < data.length; i++) {
	pMs.push({
		month: labels[i],
		year: '2020',
		total: data[i],
	});
}

export const performance = pMs;
