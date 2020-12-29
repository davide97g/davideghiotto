import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from './utils.service';

@Injectable({
	providedIn: 'root',
})
export class ApiService {
	host: string = 'https://ultra-degiro.herokuapp.com/';
	constructor(private http: HttpClient, private utils: UtilsService) {}

	async getPortfolio() {
		return await this.http
			.get(this.host + 'portfolio/update')
			.toPromise()
			.then((res: any) => {
				// this.utils.openSnackBar('Downloaded complete!', 'Take a look at Portfolio');
				return res.portfolio;
			})
			.catch(err => {
				this.utils.openSnackBar('Portfolio download failed', 'Please, try again.');
				console.error(err);
				return null;
			});
	}

	async getPerformance() {
		return await this.http
			.get(this.host + 'performance')
			.toPromise()
			.then((res: any) => res.performance)
			.catch(err => {
				this.utils.openSnackBar(
					'Performance download failed',
					'Check your internet connection or server status'
				);
				console.error(err);
				return null;
			});
	}

	async refreshPortfolio() {
		return await this.http
			.get(this.host + 'portfolio/refresh')
			.toPromise()
			.then((res: any) => {
				// this.utils.openSnackBar('Refresh complete!', 'Updating Portfolio...');
				return true;
			})
			.catch(err => {
				this.utils.openSnackBar('Portfolio refresh failed', 'Please, try again.');
				console.error(err);
				return null;
			});
	}
}
