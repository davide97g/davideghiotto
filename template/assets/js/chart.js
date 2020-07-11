let charts = [];
function buildCharts() {
	charts.push(
		new Chart(document.getElementById('languagesChart'), {
			type: 'radar',
			data: {
				labels: ['C++', 'Java', 'JavaScript', 'TypeScript', 'Python', 'SQL', 'R'],
				datasets: [
					{
						label: 'Programming Languages',
						data: [9, 6, 9, 9.5, 3, 6, 5],
						fill: true,
						backgroundColor: 'rgba(255, 99, 132, 0.2)',
						borderColor: 'rgb(255, 99, 132)',
						pointBackgroundColor: 'rgb(255, 99, 132)',
						pointBorderColor: '#fff',
						pointHoverBackgroundColor: '#fff',
						pointHoverBorderColor: 'rgb(255, 99, 132)',
					},
				],
			},
			options: {
				elements: { line: { tension: 0, borderWidth: 2 } },
				scale: {
					angleLines: {
						display: false,
					},
					ticks: {
						display: false,
						suggestedMin: 0,
						suggestedMax: 10,
					},
				},
				// legend: {
				// 	display: false,
				// },
			},
		})
	);

	charts.push(
		new Chart(document.getElementById('topicsChart'), {
			type: 'radar',
			data: {
				labels: [
					'Algorithms',
					'Statistics',
					'Machine Learning',
					'Database',
					'Deep Learning',
				],
				datasets: [
					{
						label: 'Data Science Topics',
						data: [9.5, 7, 8, 8, 5],
						fill: true,
						backgroundColor: 'rgba(54, 162, 235, 0.2)',
						borderColor: 'rgb(54, 162, 235)',
						pointBackgroundColor: 'rgb(54, 162, 235)',
						pointBorderColor: '#fff',
						pointHoverBackgroundColor: '#fff',
						pointHoverBorderColor: 'rgb(54, 162, 235)',
					},
				],
			},
			options: {
				elements: { line: { tension: 0, borderWidth: 2 } },
				scale: {
					angleLines: {
						display: false,
					},
					ticks: {
						display: false,
						suggestedMin: 0,
						suggestedMax: 10,
					},
				},
				// legend: {
				// 	display: false,
				// },
			},
		})
	);
}

(function ($) {
	buildCharts();
})(jQuery);