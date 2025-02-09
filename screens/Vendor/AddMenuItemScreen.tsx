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
import {
    queryDocument,
    updateDocument,
    uploadDocument,
} from '@/lib/firebase/firestore';
import { Collections } from '@/types/collections';
import type { MenuItem, Shop } from '@/types/shop';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';

export default function AddMenuItemScreen() {
    const { user } = useAuth();

    const [image, setImage] = useState<string | null>(null);
    const [menuItem, setMenuItem] = useState<MenuItem>({
        vendorId: user?.id as string,
        name: '',
        price: 0,
        image: '',
        isAvailable: true,
        stockCount: 0,
    });
    const [errors, setErrors] = useState({
        name: '',
        price: '',
        stockCount: '',
    });

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setMenuItem((prev) => ({ ...prev, image: result.assets[0].uri }));
        }
    };

    function validateForm() {
        let isValid = true;
        const newErrors = { name: '', price: '', stockCount: '' };

        if (!menuItem.name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        }
        if (menuItem.price <= 0) {
            newErrors.price = 'Price must be greater than 0';
            isValid = false;
        }
        if (menuItem.stockCount < 0) {
            newErrors.stockCount = 'Stock count cannot be negative';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    }

    async function handleAddItem() {
        if (!validateForm()) return;

        try {
            const createResult = await uploadDocument<MenuItem>(
                Collections.MenuItems,
                menuItem
            );
            const queryShop = await queryDocument<Shop>(
                Collections.Shops,
                'vendorId',
                user?.id as string
            );

            if (
                queryShop.success &&
                queryShop.data &&
                createResult.success &&
                createResult.data
            ) {
                const updatedMenuItems = [
                    ...(queryShop.data[0].menuItems || []),
                    createResult?.docId || '',
                ];
                await updateDocument<Shop>(
                    Collections.Shops,
                    queryShop.data[0].id,
                    {
                        menuItems: updatedMenuItems,
                    }
                );
            }

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
                        {image && (
                            <Image
                                source={{ uri: image }}
                                style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: 8,
                                    alignSelf: 'center',
                                    marginBottom: 10,
                                }}
                            />
                        )}
                        <Button label={'Upload an Image'} onPress={pickImage} />
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
                            onChangeText={(text) =>
                                setMenuItem((prev) => ({
                                    ...prev,
                                    price: parseFloat(text) || 0,
                                }))
                            }
                            error={errors.price}
                        />
                        <InputField
                            label="Stock Count"
                            placeholder="Available stock count"
                            keyboardType="number-pad"
                            value={menuItem.stockCount.toString()}
                            onChangeText={(text) =>
                                setMenuItem((prev) => ({
                                    ...prev,
                                    stockCount: parseInt(text) || 0,
                                }))
                            }
                            error={errors.stockCount}
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
