export interface Stock {
	name: string;
	code: string;
	quantity: number;
	last: number;
	value?: number;
	valueEuro: number;
}

/*
Prodotto,Codice,Quantità,Ultimo,Valore,Valore in EUR
CASH & CASH FUND (USD),,,,USD 2.80,"2,32"
EDITAS MEDICINE INC,US28106W1036,10,"31,90",USD 319.00,"264,26"
FACEBOOK INC. - CLASS,US30303M1027,5,"286,55",USD 1432.75,"1186,89"
ILLUMINA INC. - COMMO,US4523271090,3,"334,34",USD 1003.02,"830,90"
INTEL CORPORATION - CO,US4581401001,10,"49,56",USD 495.60,"410,56"
INVITAE CORPORATION CO,US46185L1035,10,"50,17",USD 501.70,"415,61"
MICRON TECHNOLOGY INC,US5951121038,2,"67,08",USD 134.16,"111,14"
*/

export interface Portfolio {
	total: number;
	stocks: Stock[];
	date: string;
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
