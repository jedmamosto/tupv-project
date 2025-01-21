import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    ActivityIndicator,
    Alert,
    StatusBar,
} from 'react-native';
import { ArrowLeft } from 'react-native-feather';
import type { CheckoutScreenProps } from '../../types/navigations';
import type { CartItem } from '../../types/shop';

function CheckoutScreen({ route, navigation }: CheckoutScreenProps) {
    const [loading, setLoading] = useState(false);
    const { cartItems } = route.params;
    const [selectedPayment, setSelectedPayment] = useState<
        'counter' | 'online' | null
    >(null);

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
        setTimeout(() => {
            setLoading(false);
            if (selectedPayment === 'counter') {
                navigation.navigate('OrderConfirmation', { orderId: '123456' });
            } else {
                navigation.navigate('PaymentGateway', {
                    amount: calculateTotal(),
                    orderId: '123456',
                });
            }
        }, 2000);
    }

    function handleGoBack() {
        navigation.goBack();
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <StatusBar barStyle="default" />
            <View className="flex-row items-center bg-green-800 px-4 pb-4 pt-12">
                <TouchableOpacity onPress={handleGoBack} className="mr-4">
                    <ArrowLeft stroke="#fff" width={24} height={24} />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-white">Checkout</Text>
            </View>

            <ScrollView className="flex-1 p-4">
                <View className="mb-4 rounded-lg bg-white p-4 shadow">
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
                </View>

                <View className="mb-4 rounded-lg bg-white p-4 shadow">
                    <Text className="mb-2 text-xl font-bold text-green-800">
                        Payment Method
                    </Text>
                    <TouchableOpacity
                        onPress={() => setSelectedPayment('counter')}
                        className={`mb-2 rounded-lg border-2 p-4 ${
                            selectedPayment === 'counter'
                                ? 'border-green-800 bg-green-100'
                                : 'border-gray-300'
                        }`}
                    >
                        <Text
                            className={`text-base ${selectedPayment === 'counter' ? 'font-bold text-green-800' : 'text-gray-800'}`}
                        >
                            Pay at the counter
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setSelectedPayment('online')}
                        className={`rounded-lg border-2 p-4 ${
                            selectedPayment === 'online'
                                ? 'border-green-800 bg-green-100'
                                : 'border-gray-300'
                        }`}
                    >
                        <Text
                            className={`text-base ${selectedPayment === 'online' ? 'font-bold text-green-800' : 'text-gray-800'}`}
                        >
                            Pay online
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <View className="border-t border-gray-200 bg-white p-4">
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
            </View>
        </SafeAreaView>
    );
}

export default CheckoutScreen;
