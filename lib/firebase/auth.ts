import { setDoc, doc, Timestamp } from 'firebase/firestore';
import { auth, db } from './config';
import {
    signInWithEmailAndPassword,
    AuthError,
    UserCredential,
    createUserWithEmailAndPassword,
} from 'firebase/auth';
import { UserRole, User } from '@/types/user';

// This interface defines the structure of our authentication response
// It helps TypeScript understand what data we expect to receive
interface AuthResponse {
    success: boolean;
    error?: string;
    user?: UserCredential;
}

export async function loginWithEmailPassword(
    email: string,
    password: string
): Promise<AuthResponse> {
    try {
        // Firebase provides a built-in method for email/password authentication
        // We await this call since it's an asynchronous operation
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        return {
            success: true,
            user: userCredential,
        };
    } catch (error) {
        // Firebase returns specific error codes that we can use to provide
        // more meaningful error messages to our users
        const authError = error as AuthError;
        let errorMessage: string;

        switch (authError.code) {
            case 'auth/invalid-email':
                errorMessage = 'Please enter a valid email address';
                break;
            case 'auth/user-disabled':
                errorMessage =
                    'This account has been disabled. Please contact support';
                break;
            case 'auth/user-not-found':
                errorMessage = 'No account found with this email';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Incorrect password';
                break;
            case 'auth/too-many-requests':
                errorMessage =
                    'Too many failed attempts. Please try again later';
                break;
            default:
                errorMessage =
                    'An error occurred during login. Please try again';
        }

        return {
            success: false,
            error: errorMessage,
        };
    }
}

interface SignUpData {
    name: string;
    email: string;
    password: string;
    idNumber: string;
}

export async function signUpWithEmailPassword(
    signUpData: SignUpData
): Promise<AuthResponse> {
    try {
        // Create the user account in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            signUpData.email,
            signUpData.password
        );

        const docData: User = {
            id: userCredential.user.uid,
            name: signUpData.name,
            email: signUpData.email,
            idNumber: signUpData.idNumber,
            role: UserRole.Customer,
            createdAt: new Timestamp(new Date().getTime() / 1000, 0),
        };

        console.log('Doc data:', docData);

        // After successful authentication, store additional user data in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), docData);

        return {
            success: true,
            user: userCredential,
        };
    } catch (error) {
        const authError = error as AuthError;
        let errorMessage: string;

        switch (authError.code) {
            case 'auth/email-already-in-use':
                errorMessage =
                    'This email is already registered. Please use a different email or login.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Please enter a valid email address.';
                break;
            case 'auth/operation-not-allowed':
                errorMessage =
                    'Email/password accounts are not enabled. Please contact support.';
                break;
            case 'auth/weak-password':
                errorMessage = 'Please choose a stronger password.';
                break;
            default:
                errorMessage =
                    'An error occurred during sign up. Please try again.';
        }

        return {
            success: false,
            error: errorMessage,
        };
    }
}
