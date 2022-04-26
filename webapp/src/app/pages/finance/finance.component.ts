import { Component, OnInit } from '@angular/core';
import { Record, mock as records_mock } from 'src/app/models/weight.model';
import { ApiService } from 'src/app/services/api.service';
import Chart from 'chart.js';

@Component({
	selector: 'app-finance',
	templateUrl: './finance.component.html',
	styleUrls: ['./finance.component.scss'],
})
export class FinanceComponent implements OnInit {
	records: Record[] = [];
	chartWeight: Chart = null;
	constructor(private api: ApiService) {}

	ngOnInit(): void {
		this.getWeightRecords();
	}

	getWeightRecords() {
		console.info('get weight records');
		this.records = records_mock;
	}

	renderChartWeightProgress(records: Record[]) {
		var canvas: any = document.getElementById('chartWeight');
		var ctx = canvas.getContext('2d');
		var gradientFill = ctx.createLinearGradient(0, 500, 0, 50);
		gradientFill.addColorStop(0, 'rgba(228, 76, 196, 0.0)');
		gradientFill.addColorStop(1, 'rgba(228, 76, 196, 0.14)');
		var gradientFillInvested = ctx.createLinearGradient(0, 500, 0, 50);
		gradientFillInvested.addColorStop(0, 'rgba(29, 140, 248, 0.0)');
		gradientFillInvested.addColorStop(1, 'rgba(29, 140, 248, 0.14)');

		if (this.chartWeight) this.chartWeight.destroy();
		this.chartWeight = new Chart(ctx, {
			type: 'line',
			responsive: true,
			data: {
				labels: records.map(p => p.date),
				datasets: [
					{
						label: 'Weight (kg)',
						fill: true,
						backgroundColor: gradientFill,
						borderColor: '#e44cc4',
						borderWidth: 2,
						borderDash: [],
						borderDashOffset: 0.0,
						pointBackgroundColor: '#e44cc4',
						pointBorderColor: 'rgba(255,255,255,0)',
						pointHoverBackgroundColor: '#be55ed',
						pointBorderWidth: 20,
						pointHoverRadius: 4,
						pointHoverBorderWidth: 15,
						pointRadius: 4,
						data: records.map(r => r.weight),
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
