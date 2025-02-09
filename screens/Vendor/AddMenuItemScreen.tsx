'use client';

import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft } from 'react-native-feather';
import { Button } from '@/components/custom/Button';
import InputField from '@/components/custom/InputField';
import { useAuth } from '@/contexts/AuthContext';
import { uploadDocument } from '@/lib/firebase/firestore';
import { Collections } from '@/types/collections';
import type { MenuItem } from '@/types/shop';

export default function AddMenuItemScreen() {
    const { user } = useAuth();

    const [menuItem, setMenuItem] = useState({
        userId: user?.id as string,
        name: '',
        price: 0,
        image: '',
        isAvailable: true,
        quantity: 0,
    });
    const [errors, setErrors] = useState({
        name: '',
        price: '',
        quantity: '',
    });

    function validateForm() {
        let isValid = true;
        const newErrors = { name: '', price: '', quantity: '' };

        if (!menuItem.name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        if (menuItem.price <= 0) {
            newErrors.price = 'Price must be greater than 0';
            isValid = false;
        }

        if (menuItem.quantity < 0) {
            newErrors.quantity = 'Quantity cannot be negative';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    }

    async function handleAddItem() {
        if (!validateForm()) return;

        try {
            const newMenuItem = { ...menuItem };
            const createResult = await uploadDocument<MenuItem>(
                Collections.MenuItems,
                newMenuItem
            );

            if (createResult.success) {
                Alert.alert('Success', 'Menu item added successfully');
                router.back();
            } else {
                Alert.alert('Error', 'Failed to add menu item');
            }
        } catch (error) {
            console.error('Error adding menu item:', error);
            Alert.alert('Error', 'An unexpected error occurred');
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom']}>
            <View className="flex-1">
                <LinearGradient
                    colors={[
                        'rgba(61, 83, 0, 0.9)',
                        'rgba(61, 83, 0, 0.7)',
                        'transparent',
                    ]}
                    className="absolute left-0 right-0 top-0 h-32"
                />
                <View className="mt-6 flex-row items-center justify-between p-4">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="rounded-full bg-white/20 p-2"
                    >
                        <ArrowLeft stroke="#fff" width={24} height={24} />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-white">
                        Add Menu Item
                    </Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView className="flex-1 px-4">
                    <Animated.View
                        entering={FadeInDown.delay(400).duration(500)}
                    >
                        <InputField
                            label="Name"
                            placeholder="Item name"
                            value={menuItem.name}
                            onChangeText={(text) =>
                                setMenuItem((prev) => ({ ...prev, name: text }))
                            }
                            error={errors.name}
                        />
                        <InputField
                            label="Price"
                            placeholder="Item price"
                            keyboardType="decimal-pad"
                            value={menuItem.price.toString()}
                            onChangeText={(text) => {
                                const price = Number.parseFloat(text) || 0;
                                setMenuItem((prev) => ({ ...prev, price }));
                            }}
                            error={errors.price}
                        />
                        <InputField
                            label="Quantity"
                            placeholder="Available quantity"
                            keyboardType="number-pad"
                            value={menuItem.quantity.toString()}
                            onChangeText={(text) => {
                                const quantity = Number.parseInt(text) || 0;
                                setMenuItem((prev) => ({ ...prev, quantity }));
                            }}
                            error={errors.quantity}
                        />
                        <Button
                            label="Add Item"
                            onPress={handleAddItem}
                            pressableClassName="mt-6 bg-primary"
                        />
                    </Animated.View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
