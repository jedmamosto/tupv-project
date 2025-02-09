'use client';

import { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    StatusBar,
    ScrollView,
    Alert,
} from 'react-native';
import { ArrowLeft } from 'react-native-feather';
import Animated, {
    FadeInDown,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import generateCheckoutLink from '@/data/paymongo/generateCheckoutLink';
import { Order, OrderItem } from '@/types/order';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@/types/enums';
import { Timestamp } from '@firebase/firestore';

export default function OrderDetails() {
    const [loading, setLoading] = useState(false);
    const params = useLocalSearchParams();

    // Parse order details received from CheckoutScreen
    const order: Order | null = params.orderDetails
        ? JSON.parse(params.orderDetails as string)
        : null;

    if (!order) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-gray-100">
                <Text className="text-xl font-bold text-red-500">
                    Invalid Order Data
                </Text>
            </SafeAreaView>
        );
    }

    // Extract order details safely
    const {
        id,
        userId,
        shopId,
        customerName,
        items = [],
        total = 0,
        status,
        paymentMethod,
        paymentId,
    } = order;

    const insets = useSafeAreaInsets();
    const scrollY = useSharedValue(0);

    const headerStyle = useAnimatedStyle(() => ({
        opacity: interpolate(scrollY.value, [0, 100], [1, 1], 'clamp'),
    }));

    const handlePayment = async () => {
        if (paymentMethod === PaymentMethod.Online) {
            setLoading(true);

            try {
                const testShopId = '3kuQQ4D8VDWRFK5AX2yxUhZ6so63';

                const checkoutLink = await generateCheckoutLink(
                    testShopId,
                    userId,
                    id
                );
                setLoading(false);

                if (checkoutLink.success && checkoutLink.checkoutUrl) {
                    router.push({ pathname: checkoutLink.checkoutUrl });
                } else {
                    Alert.alert(
                        'Error',
                        'Failed to generate payment link. Please try again.'
                    );
                }
            } catch (error) {
                setLoading(false);
                Alert.alert('Error', 'Something went wrong. Please try again.');
            }
        }
    };

    return (
        <SafeAreaView
            className="flex-1 bg-gray-100"
            style={{ paddingTop: insets.top }}
        >
            <StatusBar barStyle="light-content" backgroundColor="#3d5300" />
            <Animated.View
                style={[headerStyle, { zIndex: 100 }]}
                className="absolute left-0 right-0"
            >
                <LinearGradient
                    colors={[
                        'rgba(61, 83, 0, 0.9)',
                        'rgba(61, 83, 0, 0.7)',
                        'transparent',
                    ]}
                    className="flex-row items-center justify-between px-4 py-3"
                    style={{ marginTop: insets.top }}
                >
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="rounded-full bg-black/20 p-2"
                    >
                        <ArrowLeft stroke="#fff" width={24} height={24} />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-white">
                        Order Details
                    </Text>
                    <View style={{ width: 40 }} />
                </LinearGradient>
            </Animated.View>

            <ScrollView
                className="mt-20 flex-1 p-4"
                onScroll={(event) => {
                    scrollY.value = event.nativeEvent.contentOffset.y;
                }}
                scrollEventThrottle={16}
            >
                {/* Order Summary */}
                <Animated.View
                    entering={FadeInDown.delay(300).springify()}
                    className="mb-4 rounded-lg bg-white p-4 shadow"
                >
                    <Text className="mb-2 text-xl font-bold text-green-800">
                        Order Summary
                    </Text>
                    <Text className="mb-2 text-base text-gray-800">
                        Order ID: {id}
                    </Text>
                    <Text className="mb-2 text-base text-gray-800">
                        Customer: {customerName}
                    </Text>

                    {items.map((item: OrderItem) => (
                        <View
                            key={item.menuItemId}
                            className="mb-2 flex-row justify-between"
                        >
                            <Text className="text-base text-gray-800">
                                {item.quantity} x {item.name}
                            </Text>
                            <Text className="text-base text-gray-800">
                                ₱{item.subtotal.toFixed(2)}
                            </Text>
                        </View>
                    ))}

                    <View className="mt-4 border-t border-gray-200 pt-4">
                        <View className="flex-row justify-between">
                            <Text className="text-lg font-bold text-green-800">
                                Total
                            </Text>
                            <Text className="text-lg font-bold text-green-800">
                                ₱{total.toFixed(2)}
                            </Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Payment Method */}
                <Animated.View
                    entering={FadeInUp.delay(400).springify()}
                    className="mb-4 rounded-lg bg-white p-4 shadow"
                >
                    <Text className="mb-2 text-xl font-bold text-green-800">
                        Payment Method
                    </Text>
                    <Text className="text-base text-gray-800">
                        {paymentMethod === PaymentMethod.Counter
                            ? 'Pay at the counter'
                            : 'Pay online'}
                    </Text>
                    {paymentMethod === PaymentMethod.Online && paymentId && (
                        <Text className="mt-1 text-base text-gray-600">
                            Payment ID: {paymentId}
                        </Text>
                    )}
                </Animated.View>

                {/* Order Status */}
                <Animated.View
                    entering={FadeInUp.delay(500).springify()}
                    className="mb-4 rounded-lg bg-white p-4 shadow"
                >
                    <Text className="mb-2 text-xl font-bold text-green-800">
                        Order Status
                    </Text>
                    <Text className="text-base text-gray-800">
                        {status === OrderStatus.Pending
                            ? 'Pending'
                            : status === OrderStatus.Processing
                              ? 'Processing'
                              : status === OrderStatus.Completed
                                ? 'Completed'
                                : 'Cancelled'}
                    </Text>
                </Animated.View>
            </ScrollView>

            {/* Proceed to Payment Button */}
            {paymentMethod === PaymentMethod.Online && (
                <Animated.View
                    entering={FadeInUp.delay(600).springify()}
                    className="border-t border-gray-200 bg-white p-4"
                >
                    <TouchableOpacity
                        onPress={handlePayment}
                        disabled={loading}
                        className={`${loading ? 'bg-gray-400' : 'bg-green-800'} items-center rounded-lg p-4`}
                    >
                        {loading ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text className="text-lg font-bold text-white">
                                Proceed to Payment
                            </Text>
                        )}
                    </TouchableOpacity>
                </Animated.View>
            )}
        </SafeAreaView>
    );
}
