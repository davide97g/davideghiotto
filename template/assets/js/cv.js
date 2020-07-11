/**
 * colors
 */

// 'rgb(255, 99, 132)', // red
// 'rgb(75, 192, 192)', // green
// 'rgb(255, 205, 86)', // yellow
// 'rgb(201, 203, 207)', // blue
// 'rgb(54, 162, 235)', // grey

let charts = [];
function buildCharts() {
	charts.push(
		new Chart(document.getElementById('educationChart'), {
			type: 'line',
			data: {
				labels: [
					'2011',
					'2012',
					'2013',
					'2014',
					'2015',
					'2016',
					'Highschool Graduation',
					'2017',
					'2018',
					'2019',
					"Bachelor's Graduation",
					'2020',
					'2021',
				],
				datasets: [
					{
						label: 'Liceo Quadri Highschool',
						data: [
							'Liceo Quadri Highschool',
							'Liceo Quadri Highschool',
							'Liceo Quadri Highschool',
							'Liceo Quadri Highschool',
							'Liceo Quadri Highschool',
							'Liceo Quadri Highschool',
							"Bachelor's Degree",
						],
						fill: false,
						borderColor: 'rgb(75, 192, 192)',
						lineTension: 0,
					},
					{
						label: "Bachelor's Degree",
						data: [
							,
							,
							,
							,
							,
							,
							"Bachelor's Degree",
							"Bachelor's Degree",
							"Bachelor's Degree",
							"Bachelor's Degree",
							"Master's Degree",
						],
						fill: false,
						borderColor: 'rgb(255, 99, 132)',
						lineTension: 0,
					},
					{
						label: 'Cluster Reply',
						data: [
							,
							,
							,
							,
							,
							,
							,
							,
							,
							"Bachelor's Degree",
							'Cluster Reply',
							'Cluster Reply',
							'Cluster Reply',
						],
						fill: false,
						borderColor: 'rgb(255, 205, 86)',
						lineTension: 0,
					},
					{
						label: "Master's Degree",
						data: [
							,
							,
							,
							,
							,
							,
							,
							,
							,
							,
							"Master's Degree",
							"Master's Degree",
							"Master's Degree",
						],
						fill: false,
						borderColor: 'rgb(54, 162, 235)',
						lineTension: 0,
					},
				],
			},
			options: {
				scales: {
					yAxes: [
						{
							type: 'category',
							labels: [
								"Master's Degree",
								'Cluster Reply',
								"Bachelor's Degree",
								'Liceo Quadri Highschool',
							],
						},
					],
				},
			},
		})
	);
}

(function ($) {
	buildCharts();
})(jQuery);
