import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    StatusBar,
    Platform,
} from 'react-native';
import { ArrowLeft, Plus, Edit2, Trash2 } from 'react-native-feather';
import { Image } from 'expo-image';
import type { VendorMenuItem } from '../../types/vendor';
import { router } from 'expo-router';
import { queryAllDocuments } from '@/lib/firebase/firestore';
import { Collections } from '@/types/collections';
import { MenuItem } from '@/types/shop';

export default function ManageInventoryScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [inventory, setInventory] = useState<VendorMenuItem[]>([]);

    const fetchInventory = async () => {
        const response = await queryAllDocuments<MenuItem>(
            Collections.MenuItems
        );

        if (!response.success || !response.data) {
            console.error('Inventory data fetching failed', response.error);
            return;
        }

        const vendorMenuItems = response.data.map((menuItem) => ({
            ...menuItem,
            stockCount: menuItem.quantity ?? 0,
        }));

        setInventory(vendorMenuItems);
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-light">
            <StatusBar barStyle="default" />
            <View
                className={`flex-1 ${Platform.OS === 'android' ? 'mt-8' : ''}`}
            >
                <View className="flex-row items-center bg-primary px-4 py-4">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="mr-4"
                    >
                        <ArrowLeft stroke="#fff" width={24} height={24} />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-white">
                        Manage Inventory
                    </Text>
                </View>

                <View className="flex-1 p-4">
                    <TextInput
                        className="mb-4 rounded-lg bg-white px-4 py-2"
                        placeholder="Search inventory..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />

                    <TouchableOpacity
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
                    </TouchableOpacity>

                    <ScrollView className="flex-1">
                        {inventory.map((item) => (
                            <View
                                key={item.id}
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
                                        source={item.image}
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
                                        <View className="mt-2 flex-row">
                                            <TouchableOpacity
                                                className="mr-2 rounded-lg bg-primary/10 p-2"
                                                onPress={() =>
                                                    console.log(
                                                        'Edit item',
                                                        item.id
                                                    )
                                                }
                                            >
                                                <Edit2
                                                    stroke="#3d5300"
                                                    width={20}
                                                    height={20}
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                className="rounded-lg bg-red-100 p-2"
                                                onPress={() =>
                                                    console.log(
                                                        'Delete item',
                                                        item.id
                                                    )
                                                }
                                            >
                                                <Trash2
                                                    stroke="#dc2626"
                                                    width={20}
                                                    height={20}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View className="absolute right-4 top-4">
                                        <View className="rounded-full bg-green-100 px-3 py-1">
                                            <Text className="text-sm text-green-800">
                                                {item.isAvailable
                                                    ? 'Available'
                                                    : 'Unavailable'}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    );
}
