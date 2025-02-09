import { useState, useEffect } from 'react';
import {
    View,
    ActivityIndicator,
    Text,
    StatusBar,
    SafeAreaView,
    RefreshControl,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import BottomNav, { type TabType } from '@/components/Home/BottomNav';
import { mockShops } from '@/data/mockData';
import type { Shop } from '@/types/shop';
import HomeShopCard from '@/components/Home/HomeShopCard';
import { Button } from '@/components/custom/Button';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { queryAllDocuments } from '@/lib/firebase/firestore';
import { Collections } from '@/types/collections';

function HomeScreen() {
    const [shops, setShops] = useState<Shop[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [currentTab, setCurrentTab] = useState<TabType>('home');
    const { user } = useAuth();
    const { cartItems } = useCart();

    async function fetchShops() {
        setLoading(true);
        const shops = await queryAllDocuments(Collections.Shops);
        setShops(shops.data as Shop[]);
        setLoading(false);
    }

    useEffect(() => {
        fetchShops();
    }, []);

    function onRefresh() {
        setRefreshing(true);
        fetchShops();
        setRefreshing(false);
    }

    function handleShopPress(shopId: string) {
        router.push({
            pathname: '/(customer)/shop/[shopId]',
            params: { shopId: shopId },
        });
    }

    function handleItemPress(shopId: string, itemId: string) {
        console.log(`Navigate to item: ${itemId} in shop: ${shopId}`);
    }

    function handleTabPress(tab: TabType) {
        setCurrentTab(tab);
        if (tab === 'cart') {
            router.replace('/(customer)/cart');
        }
    }

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-light">
                <ActivityIndicator size="large" color="#3d5300" />
                <Animated.Text
                    entering={FadeInDown}
                    className="mt-4 text-primary"
                >
                    Loading shops...
                </Animated.Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#f8f9fa]">
            <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
            {currentTab === 'home' && (
                <Animated.ScrollView
                    className="flex-1 px-4 pb-4 pt-8"
                    entering={FadeInDown.duration(500)}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    <Animated.Text
                        className="mb-6 mt-3 border-b border-gray-300 pb-2 text-left text-3xl font-extrabold italic text-primary"
                        entering={FadeInDown.delay(200)}
                    >
                        Check us out!
                    </Animated.Text>
                    {shops.map((shop, index) => (
                        <Animated.View
                            key={shop.id}
                            entering={FadeInDown.delay(300 + index * 100)}
                        >
                            <HomeShopCard
                                shop={shop}
                                onShopPress={handleShopPress}
                                onItemPress={handleItemPress}
                            />
                        </Animated.View>
                    ))}
                </Animated.ScrollView>
            )}
            {currentTab === 'profile' && (
                <Animated.View
                    className="flex-1 items-center justify-center gap-6"
                    entering={FadeInDown.duration(500)}
                >
                    <Text className="text-lg text-primary">
                        Profile Options
                    </Text>
                    {user ? (
                        <Button
                            pressableClassName="w-fit px-4"
                            label="Sign Out"
                            onPress={() => signOut(auth)}
                        />
                    ) : (
                        <Button
                            pressableClassName="w-fit px-4"
                            label="Login"
                            onPress={() => router.push('/(auth)/login')}
                        />
                    )}
                </Animated.View>
            )}
            <BottomNav
                currentTab={currentTab}
                onTabPress={handleTabPress}
                cartItemCount={cartItems.length}
            />
        </SafeAreaView>
    );
}

export default HomeScreen;
