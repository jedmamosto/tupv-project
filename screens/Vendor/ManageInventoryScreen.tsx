'use client';

import { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StatusBar,
    RefreshControl,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, Edit2, Trash2 } from 'react-native-feather';
import { Image } from 'expo-image';
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { deleteDocument, queryAllDocuments } from '@/lib/firebase/firestore';
import { Collections } from '@/types/collections';
import type { MenuItem } from '@/types/shop';
import { useRouter } from 'expo-router';

const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);

export default function ManageInventoryScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [inventory, setInventory] = useState<MenuItem[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const scrollY = useSharedValue(0);
    const headerOpacity = useSharedValue(1);

    const fetchInventory = useCallback(async () => {
        const response = await queryAllDocuments<MenuItem>(
            Collections.MenuItems
        );

        if (!response.success || !response.data) {
            console.error('Inventory data fetching failed', response.error);
            return;
        }

        setInventory(response.data);
    }, []);

    useEffect(() => {
        fetchInventory();
    }, [fetchInventory]);

    function onRefresh() {
        setRefreshing(true);
        fetchInventory().then(() => setRefreshing(false));
    }

    async function handleDelete(id: string) {
        const response = await deleteDocument(Collections.MenuItems, id);

        if (!response.success) {
            console.log('Delete failed');
            return;
        }

        setInventory(inventory.filter((item) => item.id !== id));
    }

    const headerStyle = useAnimatedStyle(() => ({
        opacity: headerOpacity.value,
    }));

    const filteredInventory = inventory.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <StatusBar barStyle="light-content" backgroundColor="#3d5300" />
            <Animated.View
                style={[
                    headerStyle,
                    {
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        zIndex: 10,
                        marginTop: 30,
                    },
                ]}
            >
                <LinearGradient
                    colors={[
                        'rgba(61, 83, 0, 0.9)',
                        'rgba(61, 83, 0, 0.7)',
                        'transparent',
                    ]}
                    className="px-4 pb-4 pt-4"
                >
                    <View className="flex-row items-center justify-between">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="rounded-full bg-white/20 p-2"
                        >
                            <ArrowLeft stroke="#fff" width={24} height={24} />
                        </TouchableOpacity>
                        <Text className="text-xl font-bold text-white">
                            Manage Inventory
                        </Text>
                        <View style={{ width: 40 }} />
                    </View>
                </LinearGradient>
            </Animated.View>

            <Animated.ScrollView
                className="flex-1 px-4 pt-20"
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <Animated.View entering={FadeInDown.delay(200).duration(500)}>
                    <TextInput
                        className="mb-4 rounded-lg bg-white px-4 py-2"
                        placeholder="Search inventory..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />

                    <AnimatedTouchableOpacity
                        className="mb-4 flex-row items-center justify-center rounded-lg bg-primary px-4 py-3"
                        onPress={() =>
                            router.push(
                                '/(vendor)/tabs/(inventory)/add-menu-item'
                            )
                        }
                    >
                        <Plus stroke="#fff" width={20} height={20} />
                        <Text className="ml-2 font-medium text-light">
                            Add New Item
                        </Text>
                    </AnimatedTouchableOpacity>
                </Animated.View>

                {filteredInventory.map((item, index) => (
                    <Animated.View
                        key={item.id}
                        entering={FadeInDown.delay(
                            300 + index * 100
                        ).springify()}
                        className="mb-4 overflow-hidden rounded-xl bg-white shadow-md"
                        style={{
                            borderTopWidth: 4,
                            borderTopColor: item.isAvailable
                                ? '#22c55e'
                                : '#ef4444',
                        }}
                    >
                        <View className="relative flex-row p-4">
                            <Image
                                source={{ uri: item.image }}
                                style={{
                                    width: 120,
                                    height: 120,
                                    borderRadius: 12,
                                }}
                                className="rounded-xl"
                                contentFit="cover"
                            />
                            <View className="ml-4 flex-1">
                                <Text className="text-lg font-semibold text-primary">
                                    {item.name}
                                </Text>
                                <Text className="text-gray-600">
                                    ₱{item.price.toFixed(2)}
                                </Text>
                                <Text className="text-gray-600">
                                    Stock: {item.stockCount}
                                </Text>
                            </View>
                        </View>
                    </Animated.View>
                ))}
            </Animated.ScrollView>
        </SafeAreaView>
    );
}
