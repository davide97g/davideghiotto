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

	// ? investments

	async getPortfolio() {
		this.utils.asyncOperation.next(true);
		let res = await this.http
			.get(this.host_degiro + 'portfolio')
			.toPromise()
			.then((res: any) => res.portfolio)
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
}
