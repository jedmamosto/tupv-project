import { User } from '@/types/user';
import { getDoc, doc } from 'firebase/firestore';
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
