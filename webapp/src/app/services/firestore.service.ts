import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
	providedIn: 'root',
})
export class FirestoreService {
	db = getFirestore();
	user: User | null = null;
	constructor(private authService: AuthService, private router: Router) {
		if (this.authService.firebaseUser) {
			if (this.authService.firebaseUser)
				this.addUserIfNotPresent(this.authService.firebaseUser);
			else this.user = null;
		} else
			this.authService.firebaseUser$.subscribe(firebaseUser => {
				if (firebaseUser) this.addUserIfNotPresent(firebaseUser);
				else this.user = null;
			});
	}

	async getUserStatus(): Promise<boolean> {
		if (this.user) return true;
		return new Promise((resolve, reject) => {
			this.authService.firebaseUser$.subscribe(async (user: User) => {
				if (user) resolve(true);
				else {
					this.router.navigate(['/login']);
					reject(false);
				}
			});
		});
	}

	async addUserIfNotPresent(firebaseUser: User) {
		this.user = await this.getUser(firebaseUser.uid);
		console.info(this.user);
		if (!this.user) this.user = await this.newUser(firebaseUser);
	}

	async getUser(uid: string): Promise<User | null> {
		const docSnap = await getDoc(doc(this.db, 'users', uid));
		if (docSnap.exists()) return docSnap.data() as User;
		else return null;
	}

	async newUser(user: User): Promise<User | null> {
		return setDoc(doc(this.db, 'users', user.uid), user)
			.then(() => user)
			.catch(err => {
				console.error(err);
				return null;
			});
	}

	async updateUser(user: User): Promise<User | null> {
		return setDoc(doc(this.db, 'users', user.uid), user, { merge: true })
			.then(() => user)
			.catch(err => {
				console.error(err);
				return null;
			});
	}
}
