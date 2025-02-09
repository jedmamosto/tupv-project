import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Platform,
} from 'react-native';
import { Package, Code, Clipboard, ArrowLeft } from 'react-native-feather';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/lib/firebase/config';
import { signOut } from '@firebase/auth';
import { Button } from '@/components/custom/Button';
import { queryAllDocuments } from '@/lib/firebase/firestore';
import { Order } from '@/types/order';
import { Collections } from '@/types/collections';
import { router } from 'expo-router';
import { MenuItem } from '@/types/shop';

export default function VendorDashboardScreen() {
    const navItems = [
        {
            title: 'Inventory',
            icon: Package,
            route: 'manage-inventory',
        },
        {
            title: 'QR',
            icon: Code,
            route: 'scan-qr',
        },
        {
            title: 'Orders',
            icon: Clipboard,
            route: 'manage-orders',
        },
    ];
    const { user } = useAuth();

    const [recentOrder, setRecentOrder] = useState<Order>();
    const [menuItem, setMenuItem] = useState<MenuItem[]>();

    const fetchRecentOrder = async () => {
        const response = await queryAllDocuments<Order>(Collections.Orders);

        if (!response.success || !response.data) {
            console.error('Order fetching failed', response.error);
            return;
        }

        const orders = response.data;

        const sortedOrders = [...orders].sort(
            (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
        );

        setRecentOrder(sortedOrders[0]);
    };

    const fetchMenuItems = async () => {
        const response = await queryAllDocuments<MenuItem>(
            Collections.MenuItems
        );

        if (!response.success || !response.data) {
            console.error('Inventory data fetching failed', response.error);
            return;
        }

        const queriedMenuItems = response.data;

        // Get the menuItemIds from the recent order
        const orderMenuItemIds = recentOrder?.items.map(
            (item) => item.menuItemId
        );

        // Filter menu items that match the IDs from the recent order
        setMenuItem(
            queriedMenuItems.filter((item) =>
                orderMenuItemIds?.includes(item.id as string)
            )
        );
    };

    useEffect(() => {
        fetchRecentOrder();
        fetchMenuItems();
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-[#f5f5f5]">
            <StatusBar barStyle="default" />
            <View
                className={`flex-1 ${Platform.OS === 'android' ? 'mt-8' : ''}`}
            >
                {/* Header */}
                <View className="flex-row items-center bg-primary px-4 py-4">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="mr-4"
                    >
                        <ArrowLeft stroke="#fff" width={24} height={24} />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-white">
                        Vendor Dashboard
                    </Text>
                </View>

                {/* Navigation */}
                <View className="flex-row bg-white">
                    {navItems.map((item) => (
                        <TouchableOpacity
                            key={item.title}
                            className="flex-1 items-center border-r border-gray-100 py-3 last:border-r-0"
                            onPress={() =>
                                router.push({
                                    pathname: '/(vendor)/tabs/[slug]',
                                    params: { slug: item.route },
                                })
                            }
                        >
                            <item.icon
                                stroke="#3d5300"
                                width={24}
                                height={24}
                            />
                            <Text className="mt-1 text-sm font-medium text-primary">
                                {item.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Recent Order Card */}
                <View className="flex-1 p-4">
                    <View className="overflow-hidden rounded-xl bg-white shadow-sm">
                        <View className="bg-primary px-4 py-3">
                            <Text className="text-lg font-bold text-white">
                                Recent Order
                            </Text>
                        </View>
                        <TouchableOpacity
                            className="p-4"
                            onPress={() =>
                                router.push('/(vendor)/tabs/manage-orders')
                            }
                        >
                            <View className="mb-3 flex-row items-center justify-between">
                                <Text className="text-lg font-bold text-primary">
                                    Order #{recentOrder?.id}
                                </Text>
                                <View className="rounded-full bg-[#fff3cd] px-3 py-1">
                                    <Text className="text-sm font-medium text-[#856404]">
                                        {recentOrder?.status.toUpperCase()}
                                    </Text>
                                </View>
                            </View>
                            <Text className="mb-3 text-gray-600">
                                Customer: {recentOrder?.customerName}
                            </Text>
                            {recentOrder?.items.map((orderItem) => {
                                const menuItemDetails = menuItem?.find(
                                    (menu) => menu.id === orderItem.menuItemId
                                );

                                return (
                                    <View
                                        key={orderItem.menuItemId}
                                        className="mb-2 flex-row justify-between"
                                    >
                                        <Text className="text-primary">
                                            {/* Display quantity and name */}
                                            {menuItemDetails?.quantity}x{' '}
                                            {menuItemDetails?.name}
                                        </Text>
                                        <Text className="font-medium text-primary">
                                            ₱
                                            {(
                                                menuItemDetails?.price || 0
                                            ).toFixed(2)}
                                        </Text>
                                        <View className="mt-3 border-t border-gray-100 pt-3">
                                            <View className="flex-row justify-between">
                                                <Text className="font-bold text-primary">
                                                    Total
                                                </Text>
                                                <Text className="font-bold text-primary">
                                                    ₱
                                                    {menuItemDetails?.price.toFixed(
                                                        2
                                                    )}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                );
                            })}
                        </TouchableOpacity>
                    </View>
                    <View className="mt-16">
                        {user ? (
                            <Button
                                pressableClassName="w-fit px-4"
                                label="Sign Out"
                                onPress={() => signOut(auth)}
                            />
                        ) : (
                            <Button
                                pressableClassName="w-fit px-4"
                                label="Login"
                                onPress={() => router.push('/(auth)/login')}
                            />
                        )}
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
