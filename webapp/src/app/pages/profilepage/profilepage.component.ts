import { Component, OnInit, OnDestroy } from '@angular/core';
import { Project } from 'src/app/models/project.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
	selector: 'app-profilepage',
	templateUrl: 'profilepage.component.html',
	styleUrls: ['profilepage.component.sass'],
})
export class ProfilepageComponent implements OnInit, OnDestroy {
	isCollapsed = true;
	projects: Project[] = [
		{
			title: 'Market Value Soccer Players',
			github: 'https://github.com/davide97g/statistical-learning',
			img: 'assets/img/projects/screen_statistical_learning.png',
			tags: ['soccer', 'statistical-learning'],
			website: 'https://davide97g.github.io/statistical-learning/',
		},
		{
			title: 'Fashion MNIST',
			github: 'https://github.com/davide97g/ml-modules',
			img: 'assets/img/projects/screen_ml_modules.png',
			tags: ['machine-learning', 'mnist'],
			website: null,
		},
		{
			title: 'Dynamic Shirts',
			github: null,
			img: 'assets/img/projects/screen_zeuscode.png',
			tags: ['qr', 'firebase', 'angular'],
			website: 'https://zeuscode.it',
		},
		{
			title: 'Life in Weeks',
			github: 'https://github.com/davide97g/life4weeks',
			img: 'assets/img/projects/screen_life_in_weeks.png',
			tags: ['diary', 'firebase', 'angular'],
			website: 'https://life-4-weeks.web.app/',
		},
	];
	constructor(private utils: UtilsService) {}

	ngOnInit() {
		// stop the progress bar
		this.utils.asyncOperation.next(false);
		var body = document.getElementsByTagName('body')[0];
		body.classList.add('profile-page');
	}
	ngOnDestroy() {
		var body = document.getElementsByTagName('body')[0];
		body.classList.remove('profile-page');
	}
}
