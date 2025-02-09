'use client';

import { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    RefreshControl,
} from 'react-native';
import {
    ArrowLeft,
    Package,
    Clock,
    CheckCircle,
    XCircle,
} from 'react-native-feather';
import Animated, {
    FadeInDown,
    FadeOutUp,
    useAnimatedStyle,
    useSharedValue,
    useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import type { Order } from '@/types/vendor';
import { router } from 'expo-router';
import { Collections } from '@/types/collections';
import { queryAllDocuments, updateDocument } from '@/lib/firebase/firestore';
import type { MenuItem } from '@/types/shop';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);

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
    const [orders, setOrders] = useState<Order[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const insets = useSafeAreaInsets();

    const scrollY = useSharedValue(0);
    const headerOpacity = useSharedValue(1);

    const statuses: { status: Order['status']; icon: any; label: string }[] = [
        { status: 'received', icon: Package, label: 'Received' },
        { status: 'ready', icon: Clock, label: 'Ready' },
        { status: 'complete', icon: CheckCircle, label: 'Complete' },
        { status: 'cancelled', icon: XCircle, label: 'Cancelled' },
    ];

    const fetchData = useCallback(async () => {
        const ordersResponse = await queryAllDocuments<Order>(
            Collections.Orders
        );
        if (ordersResponse.success && ordersResponse.data) {
            setOrders(ordersResponse.data);
        }

        const menuItemsResponse = await queryAllDocuments<MenuItem>(
            Collections.MenuItems
        );
        if (menuItemsResponse.success && menuItemsResponse.data) {
            const orderIds =
                ordersResponse.data?.flatMap((order) =>
                    order.items.map((item) => item.menuItemId)
                ) || [];
            setMenuItems(
                menuItemsResponse.data.filter((item) =>
                    orderIds.includes(item.id as string)
                )
            );
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    }, [fetchData]);

    const handleOrderUpdate = async (order: Order, status: Order['status']) => {
        const updatedOrder: Order = { ...order, status: status };
        const orderUpdate = await updateDocument<Order>(
            Collections.Orders,
            order.id as string,
            updatedOrder
        );
        if (orderUpdate.success) {
            setOrders((currentOrders) =>
                currentOrders.map((currentOrder) =>
                    currentOrder.id === order.id ? updatedOrder : currentOrder
                )
            );
        }
    };

    const headerStyle = useAnimatedStyle(() => ({
        opacity: headerOpacity.value,
    }));

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    const filteredOrders = orders.filter(
        (order) => order.status === selectedStatus
    );

    return (
        <SafeAreaView
            className="flex-1 bg-gray-100"
            style={{ paddingTop: insets.top }}
        >
            <StatusBar barStyle="light-content" backgroundColor="#3d5300" />
            <Animated.View
                style={[
                    headerStyle,
                    {
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        zIndex: 10,
                        marginTop: 25,
                    },
                ]}
            >
                <LinearGradient
                    colors={[
                        'rgba(61, 83, 0, 0.9)',
                        'rgba(61, 83, 0, 0.7)',
                        'transparent',
                    ]}
                    className="px-4 pb-4 pt-4"
                >
                    <View className="flex-row items-center justify-between">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="mr-4"
                        >
                            <ArrowLeft stroke="#fff" width={24} height={24} />
                        </TouchableOpacity>
                        <Text className="text-xl font-bold text-white">
                            Manage Orders
                        </Text>
                        <View style={{ width: 24 }} />
                    </View>
                </LinearGradient>
            </Animated.View>

            <View className="flex-row bg-white shadow-sm">
                {statuses.map(({ status, icon: Icon, label }) => (
                    <AnimatedTouchableOpacity
                        key={status}
                        onPress={() => setSelectedStatus(status)}
                        className={`mt-12 flex-1 items-center py-3 ${selectedStatus === status ? 'border-b-2 border-primary' : ''}`}
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
                            className={`mt-1 text-xs font-medium ${selectedStatus === status ? 'text-primary' : 'text-gray-600'}`}
                        >
                            {label}
                        </Text>
                    </AnimatedTouchableOpacity>
                ))}
            </View>

            <Animated.ScrollView
                className="flex-1 px-4 pt-4"
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                {filteredOrders.length === 0 ? (
                    <Animated.View
                        entering={FadeInDown}
                        exiting={FadeOutUp}
                        className="flex-1 items-center justify-center py-8"
                    >
                        <Text className="text-gray-500">
                            No {selectedStatus} orders
                        </Text>
                    </Animated.View>
                ) : (
                    filteredOrders.map((order, index) => (
                        <Animated.View
                            key={order.id}
                            entering={FadeInDown.delay(index * 100).springify()}
                            className="mb-4 overflow-hidden rounded-xl bg-white shadow-md"
                            style={{
                                borderTopWidth: 4,
                                borderTopColor: getStatusColor(order.status),
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
                                                  : order.status === 'complete'
                                                    ? 'bg-green-100'
                                                    : 'bg-red-100'
                                        }`}
                                    >
                                        <Text
                                            className={`text-xs font-semibold ${
                                                order.status === 'received'
                                                    ? 'text-yellow-800'
                                                    : order.status === 'ready'
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
                                            {order.orderQuantity}x {item.name}
                                        </Text>
                                        <Text className="text-primary">
                                            ₱
                                            {(
                                                item.price * order.orderQuantity
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
                                            onPress={() =>
                                                handleOrderUpdate(
                                                    order,
                                                    'ready'
                                                )
                                            }
                                        >
                                            <Text className="text-center font-medium text-light">
                                                Mark as Ready
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                    {order.status === 'ready' && (
                                        <TouchableOpacity
                                            className="mr-2 flex-1 rounded-lg bg-primary px-4 py-2"
                                            onPress={() =>
                                                handleOrderUpdate(
                                                    order,
                                                    'complete'
                                                )
                                            }
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
                                            onPress={() =>
                                                handleOrderUpdate(
                                                    order,
                                                    'cancelled'
                                                )
                                            }
                                        >
                                            <Text className="text-center font-medium text-light">
                                                Cancel Order
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        </Animated.View>
                    ))
                )}
            </Animated.ScrollView>
        </SafeAreaView>
    );
}
