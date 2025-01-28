import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Platform,
} from 'react-native';
import { Package, Code, Clipboard, ArrowLeft } from 'react-native-feather';
import type { VendorDashboardScreenProps } from '../../types/navigations';
import { mockRecentOrder } from '../../data/vendorMockData';

export default function VendorDashboard({
    navigation,
}: VendorDashboardScreenProps) {
    const navItems = [
        {
            title: 'Inventory',
            icon: Package,
            route: 'ManageInventory',
        },
        {
            title: 'QR',
            icon: Code,
            route: 'ScanQR',
        },
        {
            title: 'Orders',
            icon: Clipboard,
            route: 'ManageOrders',
        },
    ];

    return (
        <SafeAreaView className="flex-1 bg-[#f5f5f5]">
            <StatusBar barStyle="default" />
            <View
                className={`flex-1 ${Platform.OS === 'android' ? 'mt-8' : ''}`}
            >
                {/* Header */}
                <View className="flex-row items-center bg-primary px-4 py-4">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
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
                                navigation.navigate(item.route as any)
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
                            onPress={() => navigation.navigate('ManageOrders')}
                        >
                            <View className="mb-3 flex-row items-center justify-between">
                                <Text className="text-lg font-bold text-primary">
                                    Order #{mockRecentOrder.orderNumber}
                                </Text>
                                <View className="rounded-full bg-[#fff3cd] px-3 py-1">
                                    <Text className="text-sm font-medium text-[#856404]">
                                        {mockRecentOrder.status.toUpperCase()}
                                    </Text>
                                </View>
                            </View>
                            <Text className="mb-3 text-gray-600">
                                Customer: {mockRecentOrder.customerName}
                            </Text>
                            {mockRecentOrder.items.map((item) => (
                                <View
                                    key={item.menuItem.id}
                                    className="mb-2 flex-row justify-between"
                                >
                                    <Text className="text-primary">
                                        {item.quantity}x {item.menuItem.name}
                                    </Text>
                                    <Text className="font-medium text-primary">
                                        ₱
                                        {(
                                            item.menuItem.price * item.quantity
                                        ).toFixed(2)}
                                    </Text>
                                </View>
                            ))}
                            <View className="mt-3 border-t border-gray-100 pt-3">
                                <View className="flex-row justify-between">
                                    <Text className="font-bold text-primary">
                                        Total
                                    </Text>
                                    <Text className="font-bold text-primary">
                                        ₱{mockRecentOrder.total.toFixed(2)}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
