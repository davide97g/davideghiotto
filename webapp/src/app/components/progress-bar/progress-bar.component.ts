import { Component, OnInit, Injectable } from '@angular/core';
import { UtilsService } from '../../services/utils.service';

@Component({
	selector: 'app-progress-bar',
	templateUrl: './progress-bar.component.html',
	styleUrls: ['./progress-bar.component.scss'],
})
@Injectable({
	providedIn: 'root',
})
export class ProgressBarComponent implements OnInit {
	counter: number = 0;
	constructor(private utils: UtilsService) {
		this.utils.asyncOperation.subscribe((value: boolean) =>
			value ? (this.counter += 1) : (this.counter -= 1)
		);
	}
	ngOnInit(): void {}
}
