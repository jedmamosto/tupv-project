// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase/config';
import { getUserDoc } from '@/lib/firebase/firestore';
import { User, UserRole } from '@/types/user';
import { onAuthStateChanged } from '@firebase/auth';

// Define the shape of our context state
type AuthContextData = {
    user: User | null;
    userRole: UserRole | null;
    isLoading: boolean;
};

// Create the context with a default value matching our type
const AuthContext = createContext<AuthContextData>({
    user: null,
    userRole: null,
    isLoading: true,
});

// Create the provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Set up Firebase auth state listener
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if (firebaseUser) {
                    // User is signed in
                    const userDoc = await getUserDoc(firebaseUser.uid);

                    if (userDoc.data) {
                        setUser({
                            id: firebaseUser.uid,
                            idNumber: userDoc.data.idNumber,
                            email: firebaseUser.email!,
                            name: userDoc.data.name,
                            role: userDoc.data.role,
                        });
                    }
                } else {
                    // User is signed out
                    setUser(null);
                }
            } catch (error) {
                console.error('Auth state change error:', error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        });

        // Cleanup subscription
        return () => unsubscribe();
    }, []);

    // Provide the auth context value
    const value = {
        user,
        userRole: user?.role ?? null,
        isLoading,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

// Create a custom hook to use the auth context
export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}
