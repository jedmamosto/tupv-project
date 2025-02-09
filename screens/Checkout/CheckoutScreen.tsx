import { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    Alert,
    StatusBar,
    ScrollView,
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
import { CartItem } from '@/types/cart';
import { ExternalPathString, router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Order, OrderItem } from '@/types/order';
import { OrderStatus, PaymentMethod } from '@/types/enums';

function CheckoutScreen() {
    const [loading, setLoading] = useState(false);
    const params = useLocalSearchParams();
    const cartItems: CartItem[] = JSON.parse(params.cartItems as string);
    const [selectedPayment, setSelectedPayment] =
        useState<PaymentMethod | null>(null);
    const insets = useSafeAreaInsets();

    const scrollY = useSharedValue(0);
    const headerStyle = useAnimatedStyle(() => ({
        opacity: interpolate(scrollY.value, [0, 100], [1, 1], 'clamp'),
    }));

    function calculateTotal() {
        return cartItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
    }

    function handlePlaceOrder() {
        if (!selectedPayment) {
            Alert.alert(
                'Payment Method Required',
                'Please select a payment method.'
            );
            return;
        }

        setLoading(true);

        setTimeout(async () => {
            setLoading(false);

            // Construct the order object based on the schema
            const orderDetails: Order = {
                id: `ORD-${Math.floor(Math.random() * 1000000)}`, // Generate a mock order ID
                userId: 'mock-user-id', // Replace with actual user ID from auth
                shopId: 'mock-shop-id', // Replace with actual shop ID if available
                customerName: 'John Doe', // Replace with actual customer name
                items: cartItems.map((item) => ({
                    menuItemId: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    subtotal: item.price * item.quantity,
                })) as OrderItem[],
                total: calculateTotal(),
                status: OrderStatus.Pending, // Default order status
                paymentMethod: selectedPayment,
                paymentId:
                    selectedPayment === PaymentMethod.Online
                        ? `PAY-${Math.floor(Math.random() * 1000000)}`
                        : undefined,
            };

            router.push({
                pathname: '/(customer)/order-details',
                params: {
                    orderDetails: JSON.stringify(orderDetails), // Pass as JSON string
                },
            });
        }, 2000);
    }

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
                </LinearGradient>
            </Animated.View>

            <ScrollView
                className="mt-20 flex-1 p-4"
                onScroll={(event) => {
                    scrollY.value = event.nativeEvent.contentOffset.y;
                }}
                scrollEventThrottle={16}
            >
                <Animated.View
                    entering={FadeInDown.delay(300).springify()}
                    className="mb-4 rounded-lg bg-white p-4 shadow"
                >
                    <Text className="mb-2 text-xl font-bold text-green-800">
                        Order Summary
                    </Text>
                    {cartItems.map((item: CartItem) => (
                        <View
                            key={item.id}
                            className="mb-2 flex-row justify-between"
                        >
                            <Text className="text-base text-gray-800">
                                {item.quantity} x {item.name}
                            </Text>
                            <Text className="text-base text-gray-800">
                                ₱{(item.price * item.quantity).toFixed(2)}
                            </Text>
                        </View>
                    ))}
                    <View className="mt-4 border-t border-gray-200 pt-4">
                        <View className="flex-row justify-between">
                            <Text className="text-lg font-bold text-green-800">
                                Total
                            </Text>
                            <Text className="text-lg font-bold text-green-800">
                                ₱{calculateTotal().toFixed(2)}
                            </Text>
                        </View>
                    </View>
                </Animated.View>

                <Animated.View
                    entering={FadeInUp.delay(400).springify()}
                    className="mb-4 rounded-lg bg-white p-4 shadow"
                >
                    <Text className="mb-2 text-xl font-bold text-green-800">
                        Payment Method
                    </Text>
                    <TouchableOpacity
                        onPress={() =>
                            setSelectedPayment(PaymentMethod.Counter)
                        }
                        className={`mb-2 rounded-lg border-2 p-4 ${
                            selectedPayment === PaymentMethod.Counter
                                ? 'border-green-800 bg-green-100'
                                : 'border-gray-300'
                        }`}
                    >
                        <Text
                            className={`text-base ${selectedPayment === PaymentMethod.Counter ? 'font-bold text-green-800' : 'text-gray-800'}`}
                        >
                            Pay at the counter
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setSelectedPayment(PaymentMethod.Online)}
                        className={`rounded-lg border-2 p-4 ${
                            selectedPayment === PaymentMethod.Online
                                ? 'border-green-800 bg-green-100'
                                : 'border-gray-300'
                        }`}
                    >
                        <Text
                            className={`text-base ${selectedPayment === PaymentMethod.Online ? 'font-bold text-green-800' : 'text-gray-800'}`}
                        >
                            Pay online
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>

            <Animated.View
                entering={FadeInUp.delay(600).springify()}
                className="border-t border-gray-200 bg-white p-4"
            >
                <TouchableOpacity
                    onPress={handlePlaceOrder}
                    disabled={loading}
                    className={`${loading ? 'bg-gray-400' : 'bg-green-800'} items-center rounded-lg p-4`}
                >
                    {loading ? (
                        <ActivityIndicator color="#ffffff" />
                    ) : (
                        <Text className="text-lg font-bold text-white">
                            Place Order
                        </Text>
                    )}
                </TouchableOpacity>
            </Animated.View>
        </SafeAreaView>
    );
}

export default CheckoutScreen;
