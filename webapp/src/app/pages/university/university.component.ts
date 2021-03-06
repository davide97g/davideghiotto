import { Component, OnInit } from '@angular/core';
import { Exam, ExamResult } from 'src/app/models/exam.model';
import { ApiService } from 'src/app/services/api.service';
import { UtilsService } from 'src/app/services/utils.service';
import Chart from 'chart.js';

@Component({
	selector: 'app-university',
	templateUrl: './university.component.html',
	styleUrls: ['./university.component.scss'],
})
export class UniversityComponent implements OnInit {
	exams: Exam[] = [];
	exams_results: ExamResult[] = [];
	average: number = 0;
	weighted_average: number = 0;
	chartExams: Chart = null;
	focus: boolean = false;
	password: string = null;
	constructor(private utils: UtilsService, private api: ApiService) {}

	ngOnInit(): void {
		this.getExamsRegistered();
		this.getExamsResults();
	}

	getExamsRegistered() {
		this.api
			.getExamsRegistered()
			.then((exams: Exam[]) => {
				this.exams = exams;
				this.computeAverage();
				this.computeWeightedAverage();
				this.renderChartExams();
			})
			.catch(err => console.error(err));
	}

	getExamsResults() {
		this.api
			.getExamsResults()
			.then((exams_results: ExamResult[]) => {
				this.exams_results = exams_results;
			})
			.catch(err => console.error(err));
	}

	computeAverage() {
		let sum = 0;
		let total = 0;
		this.exams.forEach(exam => {
			if (exam.mark) {
				sum += exam.mark == '30L' ? 30 : parseInt(exam.mark);
				total += 1;
			}
		});
		this.average = Math.round((sum / total) * 100) / 100;
	}

	computeWeightedAverage() {
		let sum = 0;
		let total_cfu = 0;
		this.exams.forEach(exam => {
			if (exam.mark) {
				sum += (exam.mark == '30L' ? 30 : parseInt(exam.mark)) * parseInt(exam.cfu);
				total_cfu += parseInt(exam.cfu);
			}
		});
		this.weighted_average = Math.round((sum / total_cfu) * 100) / 100;
	}

	renderChartExams() {
		var canvas: any = document.getElementById('chartExams');
		var ctx = canvas.getContext('2d');
		this.chartExams = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: this.exams.map(e => e.name),
				datasets: [
					{
						label: 'Data Science Exams',
						data: this.exams.map(e => (e.mark == '30L' ? 30 : parseInt(e.mark))),
						fill: false,
						backgroundColor: [
							'rgba(255, 99, 132, 0.2)',
							'rgba(255, 159, 64, 0.2)',
							'rgba(255, 205, 86, 0.2)',
							'rgba(75, 192, 192, 0.2)',
							'rgba(54, 162, 235, 0.2)',
							'rgba(153, 102, 255, 0.2)',
							'rgba(201, 203, 207, 0.2)',
							'rgba(255, 99, 132, 0.2)',
							'rgba(255, 159, 64, 0.2)',
							'rgba(255, 205, 86, 0.2)',
							'rgba(75, 192, 192, 0.2)',
							'rgba(54, 162, 235, 0.2)',
							'rgba(153, 102, 255, 0.2)',
							'rgba(201, 203, 207, 0.2)',
							'rgba(255, 99, 132, 0.2)',
							'rgba(255, 159, 64, 0.2)',
							'rgba(255, 205, 86, 0.2)',
							'rgba(75, 192, 192, 0.2)',
						],
						borderColor: [
							'rgb(255, 99, 132)',
							'rgb(255, 159, 64)',
							'rgb(255, 205, 86)',
							'rgb(75, 192, 192)',
							'rgb(54, 162, 235)',
							'rgb(153, 102, 255)',
							'rgb(201, 203, 207)',
							'rgb(255, 99, 132)',
							'rgb(255, 159, 64)',
							'rgb(255, 205, 86)',
							'rgb(75, 192, 192)',
							'rgb(54, 162, 235)',
							'rgb(153, 102, 255)',
							'rgb(201, 203, 207)',
							'rgb(255, 99, 132)',
							'rgb(255, 159, 64)',
							'rgb(255, 205, 86)',
							'rgb(75, 192, 192)',
						],
						borderWidth: 1,
					},
				],
			},
			options: { scales: { yAxes: [{ ticks: { beginAtZero: true } }] } },
		});
	}

	updateExams(password: string) {
		console.info('updateExams', password);
		this.api
			.updateExamsRegistered(password)
			.then(res => {
				console.info(res);
			})
			.catch(err => console.error(err));
	}
}
