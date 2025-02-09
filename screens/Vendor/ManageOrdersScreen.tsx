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
import { router } from 'expo-router';
import { Collections } from '@/types/collections';
import { queryAllDocuments, updateDocument } from '@/lib/firebase/firestore';
import { MenuItem } from '@/types/shop';
import { Order } from '@/types/order';
import { OrderStatus } from '@/types/enums';
import { Timestamp } from 'firebase/firestore';

function getStatusColor(status: OrderStatus) {
    switch (status) {
        case OrderStatus.Pending:
            return '#fef9c3'; // Yellow
        case OrderStatus.Processing:
            return '#dbeafe'; // Blue
        case OrderStatus.Completed:
            return '#dcfce7'; // Green
        case OrderStatus.Cancelled:
            return '#fee2e2'; // Red
        default:
            return '#f3f4f6'; // Gray
    }
}

export default function ManageOrdersScreen() {
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
        OrderStatus.Pending
    );

    const statuses: {
        status: OrderStatus;
        icon: any;
        label: string;
    }[] = [
        { status: OrderStatus.Pending, icon: Package, label: 'Pending' },
        { status: OrderStatus.Processing, icon: Clock, label: 'Processing' },
        {
            status: OrderStatus.Completed,
            icon: CheckCircle,
            label: 'Completed',
        },
        { status: OrderStatus.Cancelled, icon: XCircle, label: 'Cancelled' },
    ];

    const [orders, setOrders] = useState<Order[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

    const fetchOrders = async () => {
        const response = await queryAllDocuments<Order>(Collections.Orders);

        if (!response.success || !response.data) {
            console.error('Order data fetching failed', response.error);
            return;
        }

        setOrders(response.data);
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

        setMenuItems(
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

    const handleOrderUpdate = async (order: Order, status: OrderStatus) => {
        const updatedOrder: Order = {
            ...order,
            status,
            updatedAt: Timestamp.now(),
        };

        const orderUpdate = await updateDocument<Order>(
            Collections.Orders,
            order.id,
            updatedOrder
        );

        if (!orderUpdate.success) {
            console.error('Order status update failed');
            return;
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
                            className={`flex-1 items-center py-3 ${
                                selectedStatus === status
                                    ? 'border-b-2 border-primary'
                                    : ''
                            }`}
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
                                className={`mt-1 text-sm font-medium ${
                                    selectedStatus === status
                                        ? 'text-primary'
                                        : 'text-gray-600'
                                }`}
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
                                No {selectedStatus.toLowerCase()} orders
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
                                            Order #
                                            {order.id.slice(-6).toUpperCase()}
                                        </Text>
                                        <View
                                            className={`rounded-full px-3 py-1 ${
                                                order.status ===
                                                OrderStatus.Pending
                                                    ? 'bg-yellow-100'
                                                    : order.status ===
                                                        OrderStatus.Processing
                                                      ? 'bg-blue-100'
                                                      : order.status ===
                                                          OrderStatus.Completed
                                                        ? 'bg-green-100'
                                                        : 'bg-red-100'
                                            }`}
                                        >
                                            <Text
                                                className={`text-sm ${
                                                    order.status ===
                                                    OrderStatus.Pending
                                                        ? 'text-yellow-800'
                                                        : order.status ===
                                                            OrderStatus.Processing
                                                          ? 'text-blue-800'
                                                          : order.status ===
                                                              OrderStatus.Completed
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
                                    {order.items.map((orderItem) => {
                                        const menuItem = menuItems.find(
                                            (item) =>
                                                item.id === orderItem.menuItemId
                                        );
                                        return (
                                            <View
                                                key={orderItem.menuItemId}
                                                className="mb-1 flex-row items-center justify-between"
                                            >
                                                <Text className="text-primary">
                                                    {orderItem.quantity}x{' '}
                                                    {menuItem?.name ??
                                                        'Unknown Item'}
                                                </Text>
                                                <Text className="text-primary">
                                                    ₱
                                                    {orderItem.subtotal.toFixed(
                                                        2
                                                    )}
                                                </Text>
                                            </View>
                                        );
                                    })}
                                    <View className="mt-2 border-t border-gray-200 pt-2">
                                        <View className="flex-row justify-between">
                                            <Text className="font-bold text-primary">
                                                Total
                                            </Text>
                                            <Text className="font-bold text-primary">
                                                ₱{order.total.toFixed(2)}
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="mt-4 flex-row">
                                        {order.status ===
                                            OrderStatus.Pending && (
                                            <TouchableOpacity
                                                className="mr-2 flex-1 rounded-lg bg-primary px-4 py-2"
                                                onPress={() => {
                                                    setSelectedStatus(
                                                        OrderStatus.Processing
                                                    );
                                                    handleOrderUpdate(
                                                        order,
                                                        OrderStatus.Processing
                                                    );
                                                }}
                                            >
                                                <Text className="text-center font-medium text-light">
                                                    Start Processing
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                        {order.status ===
                                            OrderStatus.Processing && (
                                            <TouchableOpacity
                                                className="mr-2 flex-1 rounded-lg bg-primary px-4 py-2"
                                                onPress={() => {
                                                    setSelectedStatus(
                                                        OrderStatus.Completed
                                                    );
                                                    handleOrderUpdate(
                                                        order,
                                                        OrderStatus.Completed
                                                    );
                                                }}
                                            >
                                                <Text className="text-center font-medium text-light">
                                                    Mark as Completed
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                        {(order.status ===
                                            OrderStatus.Pending ||
                                            order.status ===
                                                OrderStatus.Processing) && (
                                            <TouchableOpacity
                                                className="flex-1 rounded-lg bg-red-500 px-4 py-2"
                                                onPress={() => {
                                                    setSelectedStatus(
                                                        OrderStatus.Cancelled
                                                    );
                                                    handleOrderUpdate(
                                                        order,
                                                        OrderStatus.Cancelled
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
