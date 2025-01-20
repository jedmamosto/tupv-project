import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { ArrowLeft, Minus, Plus, Trash2 } from 'react-native-feather';
import type { CartScreenProps } from '../../types/navigations';
import type { MenuItem } from '../../types/shop';

function CartScreen({ route, navigation }: CartScreenProps) {
    const [cartItems, setCartItems] = useState<MenuItem[]>(
        route.params.cartItems
    );
    const { shopId } = route.params;
    const [loading, setLoading] = useState(false);

    function calculateTotal() {
        return cartItems.reduce(
            (sum, item) => sum + item.price * (item.quantity || 0),
            0
        );
    }

    function handleUpdateQuantity(itemId: string, newQuantity: number) {
        if (newQuantity < 0) return;
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            )
        );
    }

    function handleRemoveItem(itemId: string) {
        setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    }

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
            navigation.navigate('Checkout', {
                cartItems: cartItems.map((item) => ({
                    ...item,
                    quantity: item.quantity || 0,
                })),
                shopId,
            });
        }, 1000);
    }

    function handleAddMoreItems() {
        navigation.goBack();
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <View className="flex-row items-center bg-green-800 px-4 pb-4 pt-12">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="mr-4"
                >
                    <ArrowLeft stroke="#fff" width={24} height={24} />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-white">Your Cart</Text>
            </View>

            <ScrollView className="flex-1 p-4">
                {cartItems.map((item: MenuItem) => (
                    <View
                        key={item.id}
                        className="mb-4 flex-row items-center justify-between rounded-lg bg-white p-4 shadow"
                    >
                        <View className="flex-1">
                            <Text className="text-base font-semibold text-green-800">
                                {item.name}
                            </Text>
                            <Text className="text-sm text-gray-600">
                                ₱{item.price.toFixed(2)}
                            </Text>
                        </View>
                        <View className="flex-row items-center">
                            <TouchableOpacity
                                onPress={() =>
                                    handleUpdateQuantity(
                                        item.id,
                                        (item.quantity || 0) - 1
                                    )
                                }
                                className="p-2"
                            >
                                <Minus
                                    stroke="#3d5300"
                                    width={20}
                                    height={20}
                                />
                            </TouchableOpacity>
                            <Text className="mx-2 font-semibold text-green-800">
                                {item.quantity}
                            </Text>
                            <TouchableOpacity
                                onPress={() =>
                                    handleUpdateQuantity(
                                        item.id,
                                        (item.quantity || 0) + 1
                                    )
                                }
                                className="p-2"
                            >
                                <Plus stroke="#3d5300" width={20} height={20} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleRemoveItem(item.id)}
                                className="ml-4 p-2"
                            >
                                <Trash2
                                    stroke="#e53e3e"
                                    width={20}
                                    height={20}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <View className="border-t border-gray-200 bg-white p-4">
                <View className="mb-4 flex-row justify-between">
                    <Text className="text-lg font-bold text-green-800">
                        Total:
                    </Text>
                    <Text className="text-lg font-bold text-green-800">
                        ₱{calculateTotal().toFixed(2)}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={handleAddMoreItems}
                    className="mb-2 items-center rounded-lg bg-gray-300 p-3"
                >
                    <Text className="font-semibold text-green-800">
                        Add More Items
                    </Text>
                </TouchableOpacity>
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
            </View>
        </SafeAreaView>
    );
}

export default CartScreen;
