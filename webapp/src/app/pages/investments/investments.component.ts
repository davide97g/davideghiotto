import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { Portfolio } from 'src/app/models/portfolio.model';
import { ApiService } from 'src/app/services/api.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
	selector: 'app-investments',
	templateUrl: './investments.component.html',
	styleUrls: ['./investments.component.scss'],
})
export class InvestmentsComponent implements OnInit {
	isCollapsed = true;
	chartPerformance: Chart = null;
	chartPortfolio: Chart = null;
	portfolio: Portfolio = {
		total: 0,
		invested: 0,
		stocks: [],
		date: new Date().toLocaleDateString(),
		full_date: '',
		exchangeUSD: 1.2,
	};
	difference: number = 0;
	portfolios: Portfolio[] = [];
	constructor(private utils: UtilsService, private api: ApiService) {}

	ngOnInit() {
		var body = document.getElementsByTagName('body')[0];
		body.classList.add('landing-page');
		// call API
		this.getPortfolio();
		this.getPortfolioAll();
	}

	ngOnDestroy() {
		var body = document.getElementsByTagName('body')[0];
		body.classList.remove('landing-page');
	}

	computePL(quantity: number, PMC: number, last: number, exchangeUSD?: number) {
		const value =
			Math.round(((last - PMC) * quantity * 100) / (exchangeUSD ? exchangeUSD : 1.2)) / 100;
		return value > 0 ? '+' + value : '' + value;
	}

	computePLPercentage(quantity: number, PMC: number, last: number) {
		const value = Math.round(((last - PMC) * 10000) / last) / 100;
		return value > 0 ? '+' + value : '' + value;
	}

	getPortfolio() {
		this.api
			.getPortfolio()
			.then((portfolio: Portfolio) => {
				this.portfolio = portfolio;
				if (this.portfolio) this.renderChartPortfolio(this.portfolio);
			})
			.catch(err => {
				this.portfolio = null;
				console.error(err);
			});
	}

	getPortfolioAll() {
		this.api
			.getPortfolioAll()
			.then((portfolios: Portfolio[]) => {
				this.portfolios = portfolios;
				if (this.portfolios) this.renderChartPerformance(this.portfolios);
			})
			.catch(err => {
				this.portfolio = null;
				console.error(err);
			});
	}

	updatePortfolio() {
		this.api
			.updatePortfolio()
			.then((res: any) => {
				if (res) this.getPortfolio();
			})
			.catch(err => console.error(err));
	}

	renderChartPortfolio(portfolio: Portfolio) {
		var canvas: any = document.getElementById('chartPortfolio');
		var ctx = canvas.getContext('2d');
		var gradientFill = ctx.createLinearGradient(0, 350, 0, 50);
		gradientFill.addColorStop(0, 'rgba(228, 76, 196, 0.0)');
		gradientFill.addColorStop(1, 'rgba(228, 76, 196, 0.14)');

		// ? sort the stocks from highest to lowest
		this.portfolio.stocks = this.portfolio.stocks.sort((s1, s2) => s2.value - s1.value);

		if (this.chartPortfolio) this.chartPortfolio.destroy();
		this.chartPortfolio = new Chart(ctx, {
			type: 'doughnut',
			responsive: true,
			data: {
				labels: portfolio.stocks.map(s => s.tick),
				datasets: [
					{
						label: 'Portfolio of ' + portfolio.date,
						fill: true,
						// backgroundColor: gradientFill,
						backgroundColor: [
							'#03045e',
							'#023e8a',
							'#0077b6',
							'#0096c7',
							'#00b4d8',
							'#48cae4',
							'#90e0ef',
							'#ade8f4',
							'#caf0f8',
							'#03045e',
							'#023e8a',
							'#0077b6',
							'#0096c7',
							'#00b4d8',
							'#48cae4',
							'#90e0ef',
							'#ade8f4',
							'#caf0f8',
						],
						borderColor: 'white',
						borderWidth: 1,
						pointBorderColor: 'rgba(255,255,255,0)',
						pointHoverBackgroundColor: '#be55ed',
						data: portfolio.stocks.map(
							stock => Math.round((stock.value * 10000) / portfolio.total) / 100
						),
					},
				],
			},
			options: {
				maintainAspectRatio: false,
				legend: {
					display: true,
					labels: {
						fontColor: 'whitesmoke',
					},
					onClick: function (event, legendItem) {
						// console.info(legendItem);
						window.open('https://finance.yahoo.com/quote/' + legendItem.text);
					},
				},
				tooltips: {
					backgroundColor: '#fff',
					titleFontColor: '#ccc',
					bodyFontColor: '#666',
					bodySpacing: 4,
					xPadding: 12,
					mode: 'nearest',
					intersect: 0,
					position: 'nearest',
				},
				responsive: true,
			},
		});
	}

	renderChartPerformance(portfolios: Portfolio[]) {
		var canvas: any = document.getElementById('chartPerformance');
		var ctx = canvas.getContext('2d');
		var gradientFill = ctx.createLinearGradient(0, 500, 0, 50);
		gradientFill.addColorStop(0, 'rgba(228, 76, 196, 0.0)');
		gradientFill.addColorStop(1, 'rgba(228, 76, 196, 0.14)');
		var gradientFillInvested = ctx.createLinearGradient(0, 500, 0, 50);
		gradientFillInvested.addColorStop(0, 'rgba(29, 140, 248, 0.0)');
		gradientFillInvested.addColorStop(1, 'rgba(29, 140, 248, 0.14)');
		portfolios.forEach(p => {
			if (!p.invested) {
				p.invested = 0;
				p.stocks.forEach(s => {
					p.invested += s.PMC * s.quantity;
				});
			}
			p.invested /= p.exchangeUSD ? p.exchangeUSD : 1.2;
			p.invested = Math.round(p.invested * 100) / 100;
		});

		this.difference =
			this.portfolios[this.portfolios.length - 1].total -
			this.portfolios[this.portfolios.length - 1].invested;

		if (this.chartPerformance) this.chartPerformance.destroy();
		this.chartPerformance = new Chart(ctx, {
			type: 'line',
			responsive: true,
			data: {
				labels: portfolios.map(p => p.date),
				datasets: [
					{
						label: 'Portfolio €',
						fill: true,
						backgroundColor: gradientFill,
						borderColor: '#e44cc4',
						borderWidth: 2,
						borderDash: [],
						borderDashOffset: 0.0,
						pointBackgroundColor: '#e44cc4',
						pointBorderColor: 'rgba(255,255,255,0)',
						pointHoverBackgroundColor: '#be55ed',
						//pointHoverBorderColor:'rgba(35,46,55,1)',
						pointBorderWidth: 20,
						pointHoverRadius: 4,
						pointHoverBorderWidth: 15,
						pointRadius: 4,
						data: portfolios.map(p => p.total),
					},
					{
						label: 'Invested €',
						fill: true,
						lineTension: 0,
						backgroundColor: gradientFillInvested,
						borderColor: '#1d8cf8',
						borderWidth: 2,
						borderDash: [],
						borderDashOffset: 0.0,
						pointBackgroundColor: '#1d8cf8',
						pointBorderColor: 'rgba(255,255,255,0)',
						pointHoverBackgroundColor: '#1d8cf8',
						//pointHoverBorderColor:'rgba(35,46,55,1)',
						pointBorderWidth: 20,
						pointHoverRadius: 4,
						pointHoverBorderWidth: 15,
						pointRadius: 4,
						data: portfolios.map(p => p.invested),
					},
				],
			},
			options: {
				maintainAspectRatio: false,
				legend: {
					display: true,
				},
				tooltips: {
					backgroundColor: '#fff',
					titleFontColor: '#222222',
					bodyFontColor: '#666',
					bodySpacing: 4,
					xPadding: 12,
					mode: 'nearest',
					intersect: 0,
					position: 'nearest',
				},
				responsive: true,
				scales: {
					yAxes: [
						{
							barPercentage: 1.6,
							gridLines: {
								drawBorder: false,
								color: 'rgba(0,0,0,0.0)',
								zeroLineColor: 'transparent',
							},
							ticks: {
								display: true,
								suggestedMin: 5000,
								padding: 20,
								fontColor: '#9a9a9a',
							},
						},
					],
					xAxes: [
						{
							barPercentage: 1.6,
							gridLines: {
								drawBorder: false,
								color: 'rgba(0,0,0,0)',
								zeroLineColor: 'transparent',
							},
							ticks: {
								// display: false,
								padding: 20,
								// fontColor: '#9a9a9a',
							},
						},
					],
				},
			},
		});
	}
}
