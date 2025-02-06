import { User } from '@/types/user';
import { getDoc, doc, collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './config';

interface FirestoreResponse<T> {
    success: boolean;
    error?: string;
    docId?: string;
    data?: T;
}

export async function getUserDoc(
    userId: string
): Promise<FirestoreResponse<User>> {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        const userData = userDoc.data();

        if (!userData) {
            console.error('User data not found');
            return {
                success: false,
            };
        }
        return {
            success: true,
            docId: userDoc.id,
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
): Promise<FirestoreResponse<T>> {
    try {
        const collectionRef = collection(db, collectionName);
        const docRef = await addDoc(collectionRef, data);
        console.log('Document uploaded successfully with ID:', docRef.id);
        return {
            success: true,
            docId: docRef.id,
            data: data,
        };
    } catch (error) {
        console.error('Firestore Upload Document Error:', error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred',
        };
    }
}

export async function queryAllDocuments<T extends object>(
    collectionName: string
): Promise<FirestoreResponse<T[]>> {
    try {
        const collectionRef = collection(db, collectionName);
        const querySnapshot = await getDocs(collectionRef);
        if (!querySnapshot) {
            throw new Error('Query not found');
        }
        const queryData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as T[];
        return {
            success: true,
            data: queryData,
        };
    } catch (error) {
        console.error('Error encountered:', error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred',
        };
    }
}
