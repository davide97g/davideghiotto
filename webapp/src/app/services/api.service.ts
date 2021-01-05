import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from './utils.service';

@Injectable({
	providedIn: 'root',
})
export class ApiService {
	host: string = 'https://ultra-degiro.herokuapp.com/';
	constructor(private http: HttpClient, private utils: UtilsService) {}

	async getCurrentExchange() {
		return await this.http
			.get('https://api.exchangeratesapi.io/latest?symbols=USD')
			.toPromise()
			.then((res: any) => {
				console.info(res);
				const value = res.rates && res.rates.USD ? res.rates.USD : null;
				return value;
			})
			.catch(err => {
				this.utils.openSnackBar('Portfolio download failed', 'Please, try again.');
				console.error(err);
				return null;
			});
	}

	async getPortfolio() {
		return await this.http
			.get(this.host + 'portfolio')
			.toPromise()
			.then((res: any) => {
				console.info(res.portfolio);
				return res.portfolio;
			})
			.catch(err => {
				this.utils.openSnackBar('Portfolio download failed', 'Please, try again.');
				console.error(err);
				return null;
			});
	}

	async updatePortfolio() {
		return await this.http
			.get(this.host + 'portfolio/update')
			.toPromise()
			.then((res: any) => {
				if (res && res.message) {
					this.utils.openSnackBar('Update Complete', res.message);
					return res.message;
				} else {
					this.utils.openSnackBar('Portfolio update failed', 'Please, try again.');
					return false;
				}
			})
			.catch(err => {
				this.utils.openSnackBar('Portfolio update failed', 'Please, try again.');
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

	async getPortfolioAll() {
		return await this.http
			.get(this.host + 'portfolio/all')
			.toPromise()
			.then((res: any) => res.portfolios)
			.catch(err => {
				this.utils.openSnackBar(
					'Portfolios download failed',
					'Check your internet connection or server status'
				);
				console.error(err);
				return null;
			});
	}

	async getExams() {
		this.utils.asyncOperation.next(true);
		let res = await this.http
			.get(this.host + 'exams')
			.toPromise()
			.then((res: any) => res.exams)
			.catch(err => {
				this.utils.openSnackBar('Exams download failed', 'Please, try again.');
				console.error(err);
				return null;
			});
		this.utils.asyncOperation.next(false);
		return res;
	}

	// async refreshPortfolio() {
	// 	return await this.http
	// 		.get(this.host + 'portfolio/refresh')
	// 		.toPromise()
	// 		.then((res: any) => {
	// 			// this.utils.openSnackBar('Refresh complete!', 'Updating Portfolio...');
	// 			return true;
	// 		})
	// 		.catch(err => {
	// 			this.utils.openSnackBar('Portfolio refresh failed', 'Please, try again.');
	// 			console.error(err);
	// 			return null;
	// 		});
	// }
}
