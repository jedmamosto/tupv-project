import { User } from '@/types/user';
import { getDoc, doc, collection, addDoc } from 'firebase/firestore';
import { db } from './config';

interface FirestoreResponse {
    success: boolean;
    error?: string;
    data?: any;
}

export async function getUserDoc(userId: string): Promise<FirestoreResponse> {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        return {
            success: true,
            data: userDoc.data() as User,
        };
    } catch (error) {
        return {
            success: false,
            error: `An error occurred while fetching user data - ${error}`,
        };
    }
}

export async function uploadDocument<T extends object>(
    collectionName: string,
    data: T
) {
    try {
        const collectionRef = collection(db, collectionName);
        const docRef = await addDoc(collectionRef, data);
        console.log('Document uploaded successfully with ID:', docRef.id);
        return {
            success: true,
            docId: docRef.id,
        };
    } catch (error) {
        console.error('Firestore Upload Document Error:', error);
        return {
            success: false,
        };
    }
}
