import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import Chart from 'chart.js';
import { Portfolio, performance, PerformanceMonth } from 'src/app/models/portfolio.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
	selector: 'app-investments',
	templateUrl: './investments.component.html',
	styleUrls: ['./investments.component.scss'],
})
export class InvestmentsComponent implements OnInit {
	isCollapsed = true;
	chartPerformance: Chart = null;
	performance: PerformanceMonth[] = [];
	host: string = 'https://ultra-degiro.herokuapp.com/';
	constructor(private http: HttpClient, private utils: UtilsService) {}

	ngOnInit() {
		var body = document.getElementsByTagName('body')[0];
		body.classList.add('landing-page');
		this.getPerformance();
	}

	ngOnDestroy() {
		var body = document.getElementsByTagName('body')[0];
		body.classList.remove('landing-page');
	}

	getPerformance() {
		this.http
			.get(this.host + 'performance')
			.toPromise()
			.then((res: any) => {
				this.utils.openSnackBar('Downloaded complete!', 'Take a look at Performance');
				console.info(res);
				this.performance = res;
				this.renderChartPerformance(this.performance);
			})
			.catch(err => {
				this.utils.openSnackBar(
					'No response',
					'Check your internet connection or server status'
				);
				this.performance = null;
				console.error(err);
			});
	}

	renderChartPortfolio(portfolio: Portfolio) {}

	renderChartPerformance(performance: PerformanceMonth[]) {
		var canvas: any = document.getElementById('chartBig');
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
