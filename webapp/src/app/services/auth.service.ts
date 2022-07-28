import { Injectable } from '@angular/core';

import {
	getAuth,
	signInWithPopup,
	GoogleAuthProvider,
	User,
	onAuthStateChanged,
} from 'firebase/auth';
import { Subject } from 'rxjs';
import { UtilsService } from './utils.service';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	auth = getAuth();
	user: User;
	provider = new GoogleAuthProvider();

	firebaseUser: User | null = null;
	firebaseUser$ = new Subject<User | null>();
	constructor(private utils: UtilsService) {
		this.firebaseUser$.subscribe(firebaseUser => (this.firebaseUser = firebaseUser));
		onAuthStateChanged(
			this.auth,
			user => this.firebaseUser$.next(user),
			err => {
				console.error(err);
				this.firebaseUser$.next(null);
			}
		);
	}

	async isLoggedIn(): Promise<boolean> {
		if (this.firebaseUser) return true;
		else {
			return new Promise((resolve, reject) => {
				onAuthStateChanged(
					this.auth,
					user => {
						resolve(!!user);
					},
					err => {
						console.error(err);
						reject(false);
					}
				);
			});
		}
	}

	async googleSignIn() {
		signInWithPopup(this.auth, this.provider)
			.then(result => (this.user = result.user))
			.catch(error => this.utils.openSnackBar('Error', error.message));
	}

	logout() {
		this.auth.signOut();
	}
}
