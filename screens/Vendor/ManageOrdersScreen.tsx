'use client';

import { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    RefreshControl,
    ScrollView,
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
import { router } from 'expo-router';
import { Collections } from '@/types/collections';
import { queryAllDocuments, updateDocument } from '@/lib/firebase/firestore';
import type { MenuItem } from '@/types/shop';
import type { Order } from '@/types/order';
import { OrderStatus } from '@/types/enums';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);

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
    const [orders, setOrders] = useState<Order[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const insets = useSafeAreaInsets();

    const scrollY = useSharedValue(0);
    const headerOpacity = useSharedValue(1);

    const statuses: { status: OrderStatus; icon: any; label: string }[] = [
        { status: OrderStatus.Pending, icon: Package, label: 'Pending' },
        { status: OrderStatus.Processing, icon: Clock, label: 'Processing' },
        {
            status: OrderStatus.Completed,
            icon: CheckCircle,
            label: 'Completed',
        },
        { status: OrderStatus.Cancelled, icon: XCircle, label: 'Cancelled' },
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

    const handleOrderUpdate = async (order: Order, status: OrderStatus) => {
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
        </SafeAreaView>
    );
}
