import { User } from 'firebase/auth';
import {
	addDoc,
	collection,
	getDocs,
	getFirestore,
	query,
	setDoc,
	where,
} from 'firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';

import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { ITransaction } from '../models/transaction';

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

export interface IResult<T> {
	id: string;
	data: T;
}

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
		async getTransactions(type: 'expense' | 'earning'): Promise<IResult<ITransaction>[]> {
			const q = query(collection(db, 'transactions'), where('type', '==', type));
			const querySnapshot = await getDocs(q);
			return querySnapshot.docs.map(doc => ({
				id: doc.id,
				data: doc.data(),
			})) as IResult<ITransaction>[];
		},
		async createNewTransaction(transaction: ITransaction): Promise<boolean> {
			try {
				await addDoc(
					collection(db, 'transactions'),
					JSON.parse(JSON.stringify(transaction))
				);
				return true;
			} catch (err) {
				console.info(err);
				throw err;
			}
		},
	},
};
