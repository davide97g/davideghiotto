import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from './utils.service';

@Injectable({
	providedIn: 'root',
})
export class ApiService {
	host_degiro: string = 'https://ultra-degiro.herokuapp.com/';
	host_uniweb: string = 'https://uniweb-api.herokuapp.com/';
	constructor(private http: HttpClient, private utils: UtilsService) {}

	async getCurrentExchange() {
		this.utils.asyncOperation.next(true);
		let res = await this.http
			.get('https://api.exchangeratesapi.io/latest?symbols=USD')
			.toPromise()
			.then((res: any) => {
				// console.info(res);
				const value = res.rates && res.rates.USD ? res.rates.USD : null;
				return value;
			})
			.catch(err => {
				this.utils.openSnackBar('Portfolio download failed', 'Please, try again.');
				console.error(err);
				return null;
			});
		this.utils.asyncOperation.next(false);
		return res;
	}

	async getPortfolio() {
		this.utils.asyncOperation.next(true);
		let res = await this.http
			.get(this.host_degiro + 'portfolio')
			.toPromise()
			.then((res: any) => {
				// console.info(res.portfolio);
				return res.portfolio;
			})
			.catch(err => {
				this.utils.openSnackBar('Portfolio download failed', 'Please, try again.');
				console.error(err);
				return null;
			});
		this.utils.asyncOperation.next(false);
		return res;
	}

	async updatePortfolio() {
		this.utils.asyncOperation.next(true);
		let res = await this.http
			.get(this.host_degiro + 'portfolio/update')
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
		this.utils.asyncOperation.next(false);
		return res;
	}

	async getPerformance() {
		this.utils.asyncOperation.next(true);
		let res = await this.http
			.get(this.host_degiro + 'performance')
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
		this.utils.asyncOperation.next(true);
		return res;
	}

	async getPortfolioAll() {
		this.utils.asyncOperation.next(true);
		let res = await this.http
			.get(this.host_degiro + 'portfolio/all')
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
		this.utils.asyncOperation.next(false);
		return res;
	}

	async getExams() {
		this.utils.asyncOperation.next(true);
		let res = await this.http
			.get(this.host_uniweb + 'exams')
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

	async updateExams() {
		this.utils.asyncOperation.next(true);
		let res = await this.http
			.post(this.host_uniweb + 'exams/update', {})
			.toPromise()
			.then((res: any) => res.message)
			.catch(err => {
				this.utils.openSnackBar('Exams update failed', 'Please, try again.');
				console.error(err);
				return null;
			});
		this.utils.asyncOperation.next(false);
		return res;
	}
}
