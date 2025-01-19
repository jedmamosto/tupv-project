import { auth } from './config';
import {
  signInWithEmailAndPassword,
  AuthError,
  UserCredential
} from 'firebase/auth';

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
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    return {
      success: true,
      user: userCredential
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
        errorMessage = 'This account has been disabled. Please contact support';
        break;
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed attempts. Please try again later';
        break;
      default:
        errorMessage = 'An error occurred during login. Please try again';
    }

    return {
      success: false,
      error: errorMessage
    };
  }
}