import { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    StatusBar,
    Alert,
} from 'react-native';
import { ArrowLeft, Minus, Plus, Trash2 } from 'react-native-feather';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useCart } from '@/contexts/CartContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

function CartScreen() {
    const { cartItems, updateQuantity, removeFromCart, getCartTotal } =
        useCart();
    const [loading, setLoading] = useState(false);
    const insets = useSafeAreaInsets();

    function handleCheckout() {
        if (cartItems.length === 0) {
            Alert.alert(
                'Cart Empty',
                'Please add items to your cart before checking out.'
            );
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.push({
                pathname: '/(customer)/checkout',
                params: {
                    cartItems: JSON.stringify(
                        cartItems.map((item) => ({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            quantity: item.quantity,
                        }))
                    ),
                },
            });
        }, 1000);
    }

    function goBackToHome() {
        router.replace('/');
    }

    if (cartItems.length === 0) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-100">
                <Text className="text-lg font-bold text-gray-600">
                    Your cart is empty.
                </Text>
                <TouchableOpacity
                    onPress={goBackToHome}
                    className="mt-4 rounded-lg bg-green-800 px-4 py-2"
                >
                    <Text className="text-white">Go Back to Shop</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView
            className="flex-1 bg-gray-100"
            style={{ paddingTop: insets.top }}
        >
            <StatusBar barStyle="light-content" backgroundColor="#3d5300" />
            <View
                className="absolute left-0 right-0 z-10"
                style={{ marginTop: insets.top }}
            >
                <LinearGradient
                    colors={[
                        'rgba(61, 83, 0, 0.9)',
                        'rgba(61, 83, 0, 0.7)',
                        'transparent',
                    ]}
                    className="flex-row items-center justify-between px-4 py-3"
                >
                    <TouchableOpacity
                        onPress={goBackToHome}
                        className="rounded-full bg-black/20 p-2"
                    >
                        <ArrowLeft stroke="#fff" width={24} height={24} />
                    </TouchableOpacity>
                    <Text className="ml-4 flex-1 text-base font-bold text-white">
                        Your Cart
                    </Text>
                </LinearGradient>
            </View>
            <Animated.ScrollView
                className="mt-16 flex-1 p-4"
                entering={FadeInDown.delay(300).springify()}
            >
                {cartItems.map((item, index) => (
                    <Animated.View
                        key={item.id}
                        entering={FadeInDown.delay(index * 100).springify()}
                        className="mb-4 flex-row items-center justify-between overflow-hidden rounded-xl bg-white p-6 shadow-lg"
                    >
                        <View className="flex-1 flex-row items-center">
                            <Image
                                source={item.image}
                                style={{
                                    width: 90,
                                    height: 90,
                                    borderRadius: 10,
                                }}
                                className="mr-4 rounded-lg"
                                contentFit="cover"
                            />
                            <View>
                                <Text className="ml-4 text-lg font-semibold text-green-800">
                                    {item.name}
                                </Text>
                                <Text className="ml-4 text-sm text-gray-600">
                                    ₱{item.price.toFixed(2)}
                                </Text>
                            </View>
                        </View>
                        <View className="flex-row items-center">
                            <TouchableOpacity
                                onPress={() =>
                                    updateQuantity(
                                        item.id as string,
                                        (item.quantity || 0) - 1
                                    )
                                }
                                className="p-2"
                            >
                                <Minus
                                    stroke="#3d5300"
                                    width={24}
                                    height={24}
                                />
                            </TouchableOpacity>
                            <Text className="mx-3 text-lg font-semibold text-green-800">
                                {item.quantity}
                            </Text>
                            <TouchableOpacity
                                onPress={() =>
                                    updateQuantity(
                                        item.id as string,
                                        (item.quantity || 0) + 1
                                    )
                                }
                                className="p-2"
                            >
                                <Plus stroke="#3d5300" width={24} height={24} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() =>
                                    removeFromCart(item.id as string)
                                }
                                className="ml-4 p-2"
                            >
                                <Trash2
                                    stroke="#e53e3e"
                                    width={24}
                                    height={24}
                                />
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                ))}
            </Animated.ScrollView>
            <Animated.View
                entering={FadeInUp.delay(300).springify()}
                className="border-t border-gray-200 bg-white p-4"
            >
                <View className="mb-4 flex-row justify-between">
                    <Text className="text-lg font-bold text-green-800">
                        Total:
                    </Text>
                    <Text className="text-lg font-bold text-green-800">
                        ₱{getCartTotal().toFixed(2)}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={handleCheckout}
                    disabled={loading}
                    className={`${loading ? 'bg-gray-400' : 'bg-green-800'} items-center rounded-lg p-4`}
                >
                    {loading ? (
                        <ActivityIndicator color="#ffffff" />
                    ) : (
                        <Text className="text-lg font-bold text-white">
                            Proceed to Checkout
                        </Text>
                    )}
                </TouchableOpacity>
            </Animated.View>
        </SafeAreaView>
    );
}

export default CartScreen;
