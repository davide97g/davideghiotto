import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faRocket } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.sass'],
})
export class HomeComponent implements OnInit {
	faRocket = faRocket;
	constructor(public router: Router) {}

	ngOnInit(): void {}
}
