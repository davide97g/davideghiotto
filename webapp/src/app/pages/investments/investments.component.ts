import { Component, OnInit, OnDestroy } from '@angular/core';
import Chart from 'chart.js';
import { Portfolio, performance, PerformanceMonth } from 'src/app/models/portfolio.model';
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
	performance: PerformanceMonth[] = [];
	portfolio: Portfolio = { total: 0, stocks: [], date: new Date().toLocaleDateString() };
	constructor(private utils: UtilsService, private api: ApiService) {}

	ngOnInit() {
		var body = document.getElementsByTagName('body')[0];
		body.classList.add('landing-page');
		// call API
		this.getPortfolio();
		this.getPerformance();
	}

	ngOnDestroy() {
		var body = document.getElementsByTagName('body')[0];
		body.classList.remove('landing-page');
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

	getPerformance() {
		this.api
			.getPerformance()
			.then((performance: PerformanceMonth[]) => {
				this.performance = performance;
				if (this.performance) this.renderChartPerformance(this.performance);
			})
			.catch(err => {
				this.performance = null;
				console.error(err);
			});
	}

	refreshPortfolio() {
		this.api
			.refreshPortfolio()
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
				labels: portfolio.stocks.map(s => s.name),
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
						],
						borderColor: 'white',
						borderWidth: 1,
						pointBorderColor: 'rgba(255,255,255,0)',
						pointHoverBackgroundColor: '#be55ed',
						data: portfolio.stocks.map(
							stock =>
								Math.round(
									(stock.last * stock.quantity * 10000) / portfolio.total
								) / 100
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

	renderChartPerformance(performance: PerformanceMonth[]) {
		var canvas: any = document.getElementById('chartPerformance');
		var ctx = canvas.getContext('2d');
		var gradientFill = ctx.createLinearGradient(0, 350, 0, 50);
		gradientFill.addColorStop(0, 'rgba(228, 76, 196, 0.0)');
		gradientFill.addColorStop(1, 'rgba(228, 76, 196, 0.14)');

		if (this.chartPerformance) this.chartPerformance.destroy();
		this.chartPerformance = new Chart(ctx, {
			type: 'line',
			responsive: true,
			data: {
				labels: performance.map(p => p.month + ' ' + p.year),
				datasets: [
					{
						label: 'Total €',
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
						data: performance.map(p => p.total),
					},
				],
			},
			options: {
				maintainAspectRatio: false,
				legend: {
					display: false,
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
								display: false,
								suggestedMin: 0,
								suggestedMax: 350,
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
								padding: 20,
								fontColor: '#9a9a9a',
							},
						},
					],
				},
			},
		});
	}
}
