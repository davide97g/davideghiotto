export interface Exam {
	id: string;
	name: string;
	mark: string;
	date: string;
	year: string;
	cfu: string;
}

export interface ExamResult {
	id: string;
	name: string;
	date: string;
	last_date_reject: string;
	mark: string;
}
