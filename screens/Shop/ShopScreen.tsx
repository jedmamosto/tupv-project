import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    StatusBar,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { ShoppingCart, ArrowLeft } from 'react-native-feather';
import { Image } from 'expo-image';
import type { ShopScreenProps } from '../../types/navigations';
import type { Shop, MenuItem, ProductCategory } from '../../types/shop';
import { mockShops } from '../../data/mockData';

function ShopScreen({ route, navigation }: ShopScreenProps) {
    const [shop, setShop] = useState<Shop | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );
    const [cartItems, setCartItems] = useState<MenuItem[]>([]);
    const { shopId } = route.params;

    useEffect(() => {
        function fetchShop() {
            setTimeout(() => {
                const foundShop = mockShops.find((s) => s.id === shopId);
                if (foundShop) {
                    setShop(foundShop);
                    setSelectedCategory(foundShop.categories?.[0]?.id || null);
                }
                setLoading(false);
            }, 1000);
        }
        fetchShop();
    }, [shopId]);

    function handleAddToCart(item: MenuItem) {
        setCartItems((prev) => {
            const existingItem = prev.find((i) => i.id === item.id);
            if (existingItem) {
                return prev.map((i) =>
                    i.id === item.id
                        ? { ...i, quantity: (i.quantity || 0) + 1 }
                        : i
                );
            } else {
                return [...prev, { ...item, quantity: 1 }];
            }
        });
    }

    function handleGoToCart() {
        if (cartItems.length > 0) {
            navigation.navigate('Cart', {
                cartItems: cartItems.map((item) => ({
                    ...item,
                    quantity: item.quantity || 0,
                })),
                shopId,
            });
        }
    }

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-100">
                <StatusBar barStyle="light-content" backgroundColor="#3d5300" />
                <ActivityIndicator size="large" color="#3d5300" />
                <Text className="mt-4 text-green-800">Loading menu...</Text>
            </View>
        );
    }

    if (!shop) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-100">
                <StatusBar barStyle="light-content" backgroundColor="#3d5300" />
                <Text className="text-red-500">Shop not found</Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <StatusBar barStyle="default" />
            <View className="flex-row items-center justify-between bg-green-800 px-4 pb-4 pt-12">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="mr-4"
                >
                    <ArrowLeft stroke="#fff" width={24} height={24} />
                </TouchableOpacity>
                <Text className="flex-1 text-lg font-bold text-white">
                    {shop.name}
                </Text>
                <TouchableOpacity onPress={handleGoToCart} className="relative">
                    <ShoppingCart stroke="#fff" width={24} height={24} />
                    {cartItems.length > 0 && (
                        <View className="absolute -right-2 -top-2 h-5 w-5 items-center justify-center rounded-full bg-red-500">
                            <Text className="text-xs font-bold text-white">
                                {cartItems.length}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1">
                <Image
                    source={shop.coverImage}
                    style={{ width: '100%', height: 160 }}
                    contentFit="cover"
                />

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="px-4 py-4"
                >
                    {shop.categories?.map((category: ProductCategory) => (
                        <TouchableOpacity
                            key={category.id}
                            onPress={() => setSelectedCategory(category.id)}
                            className={`mr-2 rounded-full px-4 py-2 ${
                                selectedCategory === category.id
                                    ? 'bg-green-800'
                                    : 'bg-gray-300'
                            }`}
                        >
                            <Text
                                className={`${selectedCategory === category.id ? 'text-white' : 'text-gray-800'} font-semibold`}
                            >
                                {category.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <View className="p-4">
                    {shop.menuItems
                        .filter((item) => item.category === selectedCategory)
                        .map((item) => (
                            <View
                                key={item.id}
                                className="mx-0 mb-4 flex-row overflow-hidden rounded-xl bg-white p-4 shadow-sm"
                            >
                                <Image
                                    source={item.image}
                                    style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 8,
                                    }}
                                    className="mr-4 rounded-lg"
                                    contentFit="cover"
                                />
                                <View className="ml-2 flex-1">
                                    <Text className="text-lg font-semibold text-green-800">
                                        {item.name}
                                    </Text>
                                    <Text className="text-gray-600">
                                        {item.description}
                                    </Text>
                                    <Text className="mt-2 font-bold text-green-800">
                                        ₱{item.price.toFixed(2)}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => handleAddToCart(item)}
                                    className="self-end rounded-lg bg-green-800 px-3 py-2"
                                >
                                    <Text className="font-semibold text-white">
                                        Add
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default ShopScreen;
