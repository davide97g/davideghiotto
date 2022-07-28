import { Component, OnInit, HostListener } from '@angular/core';
import { Location } from '@angular/common';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	constructor(public location: Location) {}
	@HostListener('window:scroll', ['$event'])
	onWindowScroll() {
		var element = document.getElementById('navbar-top');
		if (window.scrollY > 100) {
			if (element) {
				element.classList.remove('navbar-transparent');
				element.classList.add('bg-danger');
			}
		} else {
			if (element) {
				element.classList.add('navbar-transparent');
				element.classList.remove('bg-danger');
			}
		}
	}
	ngOnInit() {
		this.onWindowScroll();
	}
}
