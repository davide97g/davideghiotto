import { Component, OnInit, OnDestroy } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
	selector: 'app-profilepage',
	templateUrl: 'profilepage.component.html',
	styleUrls: ['profilepage.component.sass'],
})
export class ProfilepageComponent implements OnInit, OnDestroy {
	isCollapsed = true;
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
