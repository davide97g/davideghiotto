import { User } from 'firebase/auth';
import { addDoc, collection, getDocs, getFirestore, setDoc } from 'firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';

import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { Expense } from '../models/expense';
import { Earning } from '../models/earning';

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_CONFIG_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_CONFIG_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_CONFIG_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_CONFIG_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_CONFIG_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_CONFIG_APP_ID,
	measurementId: import.meta.env.VITE_FIREBASE_CONFIG_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);

const db = getFirestore();

export const DataBaseClient = {
	async getUser(uid: string): Promise<User | null> {
		const docRef = doc(db, 'users', uid);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) return docSnap.data() as User;
		else return null;
	},
	async getUserOrCreateOne(firebaseUser: User): Promise<User> {
		const docRef = doc(db, 'users', firebaseUser.uid);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) return docSnap.data() as User;
		else return this.createNewUser(firebaseUser);
	},
	async createNewUser(firebaseUser: User): Promise<User> {
		await setDoc(doc(collection(db, 'users'), firebaseUser.uid), firebaseUser);
		return firebaseUser;
	},
	async getAllUsers(): Promise<User[]> {
		const querySnapshot = await getDocs(collection(db, 'users'));
		return querySnapshot.docs.map(doc => doc.data()) as User[];
	},
	Transactions: {
		async createNewExpense(expense: Expense): Promise<boolean> {
			try {
				await addDoc(collection(db, 'expenses'), expense);
				return true;
			} catch (err) {
				console.info(err);
				throw err;
			}
		},
		async createNewEarning(earning: Earning): Promise<boolean> {
			try {
				await addDoc(collection(db, 'earnings'), earning);
				return true;
			} catch (err) {
				console.info(err);
				throw err;
			}
		},
	},
};
