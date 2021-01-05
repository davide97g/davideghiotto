import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class UtilsService {
	asyncOperation: Subject<boolean> = new Subject<boolean>(); // signal to the progress bar
	constructor(private _snackBar: MatSnackBar) {}
	openSnackBar(message: string, action: string, duration?: number) {
		this._snackBar.open(message, action, {
			duration: duration ? duration : 2000,
		});
	}
}
