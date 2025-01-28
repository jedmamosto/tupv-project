// app/index.tsx
import { View } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/screens/Loading/LoadingScreen';

export default function Index() {
    const { isLoading } = useAuth();

    // Only handle the loading state here
    if (isLoading) {
        return <LoadingScreen />;
    }

    // The NavigationGuard in _layout.tsx will handle the routing

    // PUT HERE SPLASH SCREEN
    return <View />;
}
