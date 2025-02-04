import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from '@react-navigation/native';
import { Stack, useSegments, useRouter } from 'expo-router';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../global.css';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/user';
import { CartProvider } from '@/contexts/CartContext';

export default function RootLayout() {
    const colorScheme = useColorScheme();
    return (
        <AuthProvider>
            <ThemeProvider
                value={colorScheme === 'light' ? DarkTheme : DefaultTheme}
            >
                <CartProvider>
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
                                name="(customer)/cart"
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="(customer)/checkout"
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="(vendor)/dashboard"
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="(vendor)/tabs/manage-inventory"
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="(vendor)/tabs/manage-orders"
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="(vendor)/tabs/scan-qr"
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen name="+not-found" />
                        </Stack>
                        <StatusBar style="auto" />
                    </NavigationGuard>
                </CartProvider>
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
            console.log('User role:', userRole);
            // Only redirect if we're at the root or in the wrong role group
            if (userRole === UserRole.Customer) {
                if (!segments.length || !inCustomerGroup) {
                    router.replace('/(customer)/home');
                }
            } else if (userRole === UserRole.Vendor) {
                if (!segments.length || !inVendorGroup) {
                    router.replace('/(vendor)/dashboard');
                }
            } else {
                router.replace('/(auth)/login');
            }
        }
    }, [user, userRole, router, segments, isLoading]);

    return <>{children}</>;
}
