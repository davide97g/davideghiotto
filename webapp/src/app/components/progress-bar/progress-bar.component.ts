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
	visible: boolean = true;
	constructor(private utils: UtilsService) {
		this.utils.asyncOperation.subscribe((value: boolean) => (this.visible = value));
	}
	ngOnInit(): void {}
}
