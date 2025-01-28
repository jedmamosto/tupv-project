import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    StatusBar,
    TouchableOpacity,
} from 'react-native';
import MenuItemList from '../../components/Shop/MenuItemList';
import { Shop, MenuItem } from '../../types/shop';
import { mockShops } from '../../data/mockData';
import { ArrowLeft } from 'react-native-feather';
import { useLocalSearchParams, router } from 'expo-router';

function ShopScreen() {
    const [shop, setShop] = useState<Shop | null>(null);
    const [loading, setLoading] = useState(true);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const { shopId } = useLocalSearchParams<{ shopId: string }>();

    useEffect(() => {
        console.log('Fetching shop for shopId:', shopId);
        const foundShop = mockShops.find((s) => s.id === shopId);
        console.log('Found Shop:', foundShop);
        if (foundShop) {
            setShop(foundShop);
            setMenuItems(
                foundShop.menuItems.map((item) => ({ ...item, quantity: 0 }))
            );
        }
        setLoading(false);
    }, [shopId]);

    function handleUpdateQuantity(itemId: string, quantity: number) {
        if (quantity < 0) return;
        setMenuItems((prev) =>
            prev.map((item) =>
                item.id === itemId ? { ...item, quantity } : item
            )
        );
    }

    function handleAddToCart(item: MenuItem) {
        console.log('Adding to cart:', item);
    }

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-light">
                <StatusBar barStyle="light-content" backgroundColor="#3d5300" />
                <ActivityIndicator size="large" color="#3d5300" />
                <Text className="mt-4 text-primary">Loading menu...</Text>
            </View>
        );
    }

    if (!shop) {
        return (
            <View className="flex-1 items-center justify-center bg-light">
                <StatusBar barStyle="light-content" backgroundColor="#3d5300" />
                <Text className="text-red-500">Shop not found</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-light">
            <StatusBar barStyle="light-content" backgroundColor="#3d5300" />
            <View className="flex-row items-center bg-primary px-4 pb-4 pt-12">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mr-4"
                >
                    <ArrowLeft stroke="#fff" width={24} height={24} />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-white">
                    {shop.name}
                </Text>
            </View>

            <ScrollView className="flex-1 p-4">
                {menuItems.map((item) => (
                    <MenuItemList
                        key={item.id}
                        item={item}
                        onUpdateQuantity={handleUpdateQuantity}
                        onAddToCart={handleAddToCart}
                    />
                ))}
            </ScrollView>
        </View>
    );
}

export default ShopScreen;
