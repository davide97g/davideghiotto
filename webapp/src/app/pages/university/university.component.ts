import { Component, OnInit } from '@angular/core';
import { Exam } from 'src/app/models/exam.model';
import { ApiService } from 'src/app/services/api.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
	selector: 'app-university',
	templateUrl: './university.component.html',
	styleUrls: ['./university.component.scss'],
})
export class UniversityComponent implements OnInit {
	exams: Exam[] = [];

	constructor(private utils: UtilsService, private api: ApiService) {}

	ngOnInit(): void {
		this.getExams();
	}

	getExams() {
		this.api
			.getExams()
			.then((exams: Exam[]) => {
				this.exams = exams;
				console.table(exams);
			})
			.catch(err => console.error(err));
	}
}
