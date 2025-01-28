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
                            name="(vendor)/dashboard"
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
        const inCustomerGroup = segments[0] === '(customer)';
        const inVendorGroup = segments[0] === '(vendor)';

        if (!user && !inAuthGroup) {
            // Redirect to login if not authenticated
            router.replace('/login');
        } else if (user) {
            // Only redirect if we're at the root or in the wrong role group
            if (userRole === UserRole.Customer) {
                if (!segments.length || (!inCustomerGroup && !inAuthGroup)) {
                    router.replace('/(customer)/home');
                }
            } else if (userRole === UserRole.Vendor) {
                if (!segments.length || (!inVendorGroup && !inAuthGroup)) {
                    router.replace('/(vendor)/dashboard');
                }
            } else {
                router.replace('/(auth)/login');
            }
        }
    }, [user, userRole, router, segments, isLoading]);

    return <>{children}</>;
}
