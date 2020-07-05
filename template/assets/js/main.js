/*
	Strata by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/
function getAge() {
	let age = '23';
	try {
		let now = new Date();
		let birthdate = new Date('05/15/1997');
		let birth_year = birthdate.getFullYear();
		let this_year = now.getFullYear();
		// console.info(birth_year, this_year);
		let birth_month = birthdate.getMonth() + 1;
		let this_month = now.getMonth() + 1;
		// console.info(birth_month, this_month);
		let birth_day = birthdate.getDate();
		let this_day = now.getDate();
		// console.info(birth_day, this_day);
		let year_d = this_year - birth_year;
		if (this_month <= birth_month && this_day < birth_day) year_d--;
		age = String(year_d);
	} catch (e) {
		return '23';
	}
	return age;
}

(function ($) {
	var $window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$age = $('#age'),
		settings = {
			// Parallax background effect?
			parallax: true,

			// Parallax factor (lower = more intense, higher = less intense).
			parallaxFactor: 15,
		};
	let age = getAge();
	if ($age && $age.length > 0) $age[0].innerText = age;
	// Breakpoints.
	breakpoints({
		xlarge: ['1281px', '1800px'],
		large: ['981px', '1280px'],
		medium: ['737px', '980px'],
		small: ['481px', '736px'],
		xsmall: [null, '480px'],
	});

	// Play initial animations on page load.
	$window.on('load', function () {
		window.setTimeout(function () {
			$body.removeClass('is-preload');
		}, 100);
	});

	// Touch?
	if (browser.mobile) {
		// Turn on touch mode.
		$body.addClass('is-touch');

		// Height fix (mostly for iOS).
		window.setTimeout(function () {
			$window.scrollTop($window.scrollTop() + 1);
		}, 0);
	}

	// Footer.
	breakpoints.on('<=medium', function () {
		$footer.insertAfter($main);
	});

	breakpoints.on('>medium', function () {
		$footer.appendTo($header);
	});

	// Header.

	// Parallax background.

	// Disable parallax on IE (smooth scrolling is jerky), and on mobile platforms (= better performance).
	if (browser.name == 'ie' || browser.mobile) settings.parallax = false;

	if (settings.parallax) {
		breakpoints.on('<=medium', function () {
			$window.off('scroll.strata_parallax');
			$header.css('background-position', '');
		});

		breakpoints.on('>medium', function () {
			$header.css('background-position', 'left 0px');

			$window.on('scroll.strata_parallax', function () {
				$header.css(
					'background-position',
					'left ' + -1 * (parseInt($window.scrollTop()) / settings.parallaxFactor) + 'px'
				);
			});
		});

		$window.on('load', function () {
			$window.triggerHandler('scroll');
		});
	}

	// Main Sections: Two.

	// Lightbox gallery.
	$window.on('load', function () {
		$('#two').poptrox({
			caption: function ($a) {
				return $a.next('h3').text();
			},
			overlayColor: '#2c2c2c',
			overlayOpacity: 0.85,
			popupCloserText: '',
			popupLoaderText: '',
			selector: '.work-item a.image',
			usePopupCaption: true,
			usePopupDefaultStyling: false,
			usePopupEasyClose: false,
			usePopupNav: true,
			windowMargin: breakpoints.active('<=small') ? 0 : 50,
		});
	});

	var ctx = document.getElementById('myChart').getContext('2d');
	var chart = new Chart(ctx, {
		// The type of chart we want to create
		type: 'line',

		// The data for our dataset
		data: {
			labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
			datasets: [
				{
					label: 'My First dataset',
					backgroundColor: 'rgb(255, 99, 132)',
					borderColor: 'rgb(255, 99, 132)',
					data: [0, 10, 5, 2, 20, 30, 45],
				},
			],
		},

		// Configuration options go here
		options: {},
	});

	new Chart(document.getElementById('myChart'), {
		type: 'radar',
		data: {
			labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
			datasets: [
				{
					label: 'Skills',
					data: [65, 59, 90, 81, 56, 55, 40],
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
			elements: { line: { tension: 0, borderWidth: 3 } },
			scale: {
				angleLines: {
					display: false,
				},
				ticks: {
					suggestedMin: 0,
					suggestedMax: 100,
				},
			},
			legend: {
				display: false,
			},
		},
	});
})(jQuery);
