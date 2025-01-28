import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    ActivityIndicator,
    Text,
    StatusBar,
    SafeAreaView,
} from 'react-native';
import BottomNav, { type TabType } from '../../components/Home/BottomNav';
import { mockShops } from '../../data/mockData';
import type { Shop } from '../../types/shop';
import HomeShopCard from '../../components/Home/HomeShopCard';
import { Button } from '@/components/custom/Button';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

function HomeScreen() {
    const [shops, setShops] = useState<Shop[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentTab, setCurrentTab] = useState<TabType>('home');

    useEffect(() => {
        function fetchShops() {
            try {
                setTimeout(() => {
                    setShops(mockShops);
                    setLoading(false);
                }, 1500);
            } catch (error) {
                console.error('Error fetching shops:', error);
                setLoading(false);
            }
        }

        fetchShops();
    }, []);

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
    }

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-light">
                <ActivityIndicator size="large" color="#3d5300" />
                <Text className="mt-4 text-primary">Loading shops...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-light">
            <StatusBar barStyle="default" />
            {currentTab === 'home' && (
                <ScrollView className="flex-1 px-4 pb-4 pt-8">
                    <Text className="mb-6 text-2xl font-extrabold italic text-primary">
                        Check us out!
                    </Text>
                    {shops.map((shop) => (
                        <HomeShopCard
                            key={shop.id}
                            shop={shop}
                            onShopPress={handleShopPress}
                            onItemPress={handleItemPress}
                        />
                    ))}
                </ScrollView>
            )}
            {currentTab === 'cart' && (
                <View className="flex-1 items-center justify-center">
                    <Text className="text-lg text-primary">
                        Cart Coming Soon
                    </Text>
                </View>
            )}
            {currentTab === 'profile' && (
                <View className="flex-1 items-center justify-center gap-6">
                    <Text className="text-lg text-primary">
                        Profile Options
                    </Text>
                    <Button
                        pressableClassName="w-fit px-4"
                        label="Login"
                        onPress={() => router.push('/(auth)/login')}
                    />
                    <Button
                        pressableClassName="w-fit px-4"
                        label="Sign Out"
                        onPress={() => signOut(auth)}
                    />
                </View>
            )}
            <BottomNav currentTab={currentTab} onTabPress={handleTabPress} />
        </SafeAreaView>
    );
}

export default HomeScreen;
