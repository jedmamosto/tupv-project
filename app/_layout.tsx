import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useSegments, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';
import '../global.css';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/user';

export default function RootLayout() {
    const colorScheme = useColorScheme();
    return (
        <AuthProvider>
            <ThemeProvider
                value={colorScheme === 'light' ? DarkTheme : DefaultTheme}
            >
                <NavigationGuard>
                    <Stack>
                        <Stack.Screen
                            name="index"
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="(auth)/login"
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="(auth)/signup"
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="(customer)/home"
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="(customer)/shop/[shopId]"
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="(vendor)"
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen name="+not-found" />
                    </Stack>
                    <StatusBar style="auto" />
                </NavigationGuard>
            </ThemeProvider>
        </AuthProvider>
    );
}

function NavigationGuard({ children }: { children: React.ReactNode }) {
    const { user, userRole, isLoading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (!user && !inAuthGroup) {
            console.log('No user');
            router.replace('/login');
        } else if (user) {
            console.log('User:', user);
            if (userRole === UserRole.Customer) {
                router.replace('/(customer)/home');
            } else if (userRole === UserRole.Vendor) {
                console.log('Vendor');
                router.replace('/(auth)/login');
            } else {
                router.replace('/(auth)/login');
            }
        }
    }, [user, userRole, router, segments, isLoading]);

    return <>{children}</>;
}
