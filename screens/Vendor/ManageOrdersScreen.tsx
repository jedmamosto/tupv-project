import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Platform,
} from 'react-native';
import {
    ArrowLeft,
    Package,
    Clock,
    CheckCircle,
    XCircle,
} from 'react-native-feather';
import type { Order } from '../../types/vendor';
import { router } from 'expo-router';
import { Collections } from '@/types/collections';
import { queryAllDocuments, updateDocument } from '@/lib/firebase/firestore';
import { MenuItem } from '@/types/shop';

function getStatusColor(status: Order['status']) {
    switch (status) {
        case 'received':
            return '#fef9c3';
        case 'ready':
            return '#dbeafe';
        case 'complete':
            return '#dcfce7';
        case 'cancelled':
            return '#fee2e2';
        default:
            return '#f3f4f6';
    }
}

export default function ManageOrdersScreen() {
    const [selectedStatus, setSelectedStatus] =
        useState<Order['status']>('received');
    const statuses: {
        status: Order['status'];
        icon: any;
        label: string;
    }[] = [
        { status: 'received', icon: Package, label: 'Received' },
        { status: 'ready', icon: Clock, label: 'Ready' },
        { status: 'complete', icon: CheckCircle, label: 'Complete' },
        { status: 'cancelled', icon: XCircle, label: 'Cancelled' },
    ];
    const [orders, setOrders] = useState<Order[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

    const fetchOrders = async () => {
        const response = await queryAllDocuments<Order>(Collections.Orders);

        if (!response.success || !response.data) {
            console.error('Order data fetching failed', response.error);
            return;
        }

        const orders = response.data;

        setOrders(orders);
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

        const orderIds = orders.flatMap((order) =>
            order.items.map((item) => item.menuItemId)
        );

        setMenuItems(() =>
            queriedMenuItems.filter((item) =>
                orderIds.includes(item.id as string)
            )
        );
    };

    useEffect(() => {
        fetchOrders();
        fetchMenuItems();
    }, []);

    const filteredOrders = orders.filter(
        (order) => order.status === selectedStatus
    );

    const handleOrderUpdate = async (order: Order, status: Order['status']) => {
        const updatedOrder: Order = { ...order, status: status };

        const orderUpdate = await updateDocument<Order>(
            Collections.Orders,
            order.id as string,
            updatedOrder
        );

        if (!orderUpdate.success) {
            console.log('Order status update failed');
        } else {
            console.log('Edit success');
        }

        setOrders((currentOrders) =>
            currentOrders.map((currentOrder) =>
                currentOrder.id === order.id ? updatedOrder : currentOrder
            )
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-light">
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
                        Manage Orders
                    </Text>
                </View>

                {/* Tabs */}
                <View className="flex-row bg-white">
                    {statuses.map(({ status, icon: Icon, label }) => (
                        <TouchableOpacity
                            key={status}
                            onPress={() => setSelectedStatus(status)}
                            className={`flex-1 items-center py-3 ${selectedStatus === status ? 'border-b-2 border-primary' : ''}`}
                        >
                            <Icon
                                stroke={
                                    selectedStatus === status
                                        ? '#3d5300'
                                        : '#687076'
                                }
                                width={20}
                                height={20}
                            />
                            <Text
                                className={`mt-1 text-sm font-medium ${selectedStatus === status ? 'text-primary' : 'text-gray-600'}`}
                            >
                                {label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Orders List */}
                <ScrollView className="flex-1 p-4">
                    {filteredOrders.length === 0 ? (
                        <View className="flex-1 items-center justify-center py-8">
                            <Text className="text-gray-500">
                                No {selectedStatus} orders
                            </Text>
                        </View>
                    ) : (
                        filteredOrders.map((order) => (
                            <View
                                key={order.id}
                                className="mb-4 overflow-hidden rounded-xl bg-white shadow-md"
                                style={{
                                    borderTopWidth: 4,
                                    borderTopColor: getStatusColor(
                                        order.status
                                    ),
                                }}
                            >
                                <View className="p-4">
                                    <View className="mb-2 flex-row items-center justify-between">
                                        <Text className="text-lg font-bold text-primary">
                                            Order #{order.orderNumber}
                                        </Text>
                                        <View
                                            className={`rounded-full px-3 py-1 ${
                                                order.status === 'received'
                                                    ? 'bg-yellow-100'
                                                    : order.status === 'ready'
                                                      ? 'bg-blue-100'
                                                      : order.status ===
                                                          'complete'
                                                        ? 'bg-green-100'
                                                        : 'bg-red-100'
                                            }`}
                                        >
                                            <Text
                                                className={`text-sm ${
                                                    order.status === 'received'
                                                        ? 'text-yellow-800'
                                                        : order.status ===
                                                            'ready'
                                                          ? 'text-blue-800'
                                                          : order.status ===
                                                              'complete'
                                                            ? 'text-green-800'
                                                            : 'text-red-800'
                                                }`}
                                            >
                                                {order.status.toUpperCase()}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text className="mb-2 text-gray-600">
                                        Customer: {order.customerName}
                                    </Text>
                                    {menuItems.map((item) => (
                                        <View
                                            key={item.id}
                                            className="mb-1 flex-row items-center justify-between"
                                        >
                                            <Text className="text-primary">
                                                {order.orderQuantity}x{' '}
                                                {item.name}
                                            </Text>
                                            <Text className="text-primary">
                                                ₱
                                                {(
                                                    item.price *
                                                    order.orderQuantity
                                                ).toFixed(2)}
                                            </Text>
                                        </View>
                                    ))}
                                    <View className="mt-2 border-t border-gray-200 pt-2">
                                        <View className="flex-row justify-between">
                                            <Text className="font-bold text-primary">
                                                Total
                                            </Text>
                                            <Text className="font-bold text-primary">
                                                ₱{order.total}
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="mt-4 flex-row">
                                        {order.status === 'received' && (
                                            <TouchableOpacity
                                                className="mr-2 flex-1 rounded-lg bg-primary px-4 py-2"
                                                onPress={() => {
                                                    setSelectedStatus('ready');
                                                    handleOrderUpdate(
                                                        order,
                                                        'ready'
                                                    );
                                                    console.log(
                                                        'Mark as ready',
                                                        order.id + order.status
                                                    );
                                                }}
                                            >
                                                <Text className="text-center font-medium text-light">
                                                    Mark as Ready
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                        {order.status === 'ready' && (
                                            <TouchableOpacity
                                                className="mr-2 flex-1 rounded-lg bg-primary px-4 py-2"
                                                onPress={() => {
                                                    setSelectedStatus(
                                                        'complete'
                                                    );
                                                    handleOrderUpdate(
                                                        order,
                                                        'complete'
                                                    );
                                                    console.log(
                                                        'Mark as complete',
                                                        order.id + order.status
                                                    );
                                                }}
                                            >
                                                <Text className="text-center font-medium text-light">
                                                    Mark as Complete
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                        {(order.status === 'received' ||
                                            order.status === 'ready') && (
                                            <TouchableOpacity
                                                className="flex-1 rounded-lg bg-red-500 px-4 py-2"
                                                onPress={() => {
                                                    setSelectedStatus(
                                                        'cancelled'
                                                    );
                                                    handleOrderUpdate(
                                                        order,
                                                        'cancelled'
                                                    );
                                                    console.log(
                                                        'Cancel order',
                                                        order.id + order.status
                                                    );
                                                }}
                                            >
                                                <Text className="text-center font-medium text-light">
                                                    Cancel Order
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            </View>
                        ))
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
