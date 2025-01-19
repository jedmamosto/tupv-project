import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    ActivityIndicator,
    Text,
    StatusBar,
    SafeAreaView,
} from 'react-native';
import BottomNav from '../../components/Home/BottomNav';
import { mockShops } from '../../data/mockData';
import type { Shop } from '../../types/shop';
import HomeShopCard from '../../components/Home/HomeShopCard';
import { HomeScreenProps } from '../../types/navigations';
import { Button } from '@/components/custom/Button';

function HomeScreen({ navigation }: HomeScreenProps) {
    const [shops, setShops] = useState<Shop[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentTab, setCurrentTab] = useState<'home' | 'cart' | 'profile'>(
        'home'
    );

    useEffect(function () {
        function fetchShops() {
            try {
                setTimeout(function () {
                    console.log(
                        'Test logging envs:',
                        process.env.EXPO_PUBLIC_FIREBASE_API_KEY
                    );
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
        console.log('Navigating to Shop with shopId:', shopId);
        navigation.navigate('Shop', { shopId });
    }

    function handleItemPress(shopId: string, itemId: string) {
        console.log(`Navigate to item: ${itemId} in shop: ${shopId}`);
    }

    function handleTabPress(tab: 'home' | 'cart' | 'profile') {
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
                    {shops.map(function (shop) {
                        return (
                            <HomeShopCard
                                key={shop.id}
                                shop={shop}
                                onShopPress={handleShopPress}
                                onItemPress={handleItemPress}
                            />
                        );
                    })}
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
                        Profile Coming Soon
                    </Text>
                    <Button
                        pressableClassName="w-fit px-4"
                        label="Login"
                        onPress={() => navigation.navigate('Login')}
                    />
                </View>
            )}
            <BottomNav currentTab={currentTab} onTabPress={handleTabPress} />
        </SafeAreaView>
    );
}

export default HomeScreen;
