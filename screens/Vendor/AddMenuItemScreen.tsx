import { Button } from '@/components/custom/Button';
import InputField from '@/components/custom/InputField';
import { useAuth } from '@/contexts/AuthContext';
import { uploadDocument } from '@/lib/firebase/firestore';
import { MenuItem } from '@/types/shop';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';

export default function AddMenuItemScreen() {
    const { user } = useAuth();

    const [image, setImage] = useState<string | null>(null);
    const [newMenuItem, setNewMenuItem] = useState({
        userId: user?.id as string,
        name: '',
        price: 0,
        image: '',
        isAvailable: true,
        quantity: 0,
    });

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            return result.assets[0].uri;
        }
    };

    // TODO: Sam add validations (check for inputs)

    // directly call firestore operations
    const handleAddItem = async () => {
        console.log(newMenuItem);

        const createMenuItem = await uploadDocument<MenuItem>(
            'menu_items',
            newMenuItem
        );

        if (!createMenuItem.success || !createMenuItem.docId) {
            console.log('Menu creation failed');
        } else {
            console.log('SUCCESS');
        }
    };

    const handleImageUpload = async () => {
        const imageUri = await pickImage();

        if (imageUri) {
            console.log('Local upload complete');
        }
    };

    // create a form to put in the data

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1">
                <View className="p-4">
                    {image && (
                        <Image
                            source={{ uri: image }}
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: 8,
                            }}
                        />
                    )}
                    <Button
                        label={'Upload an Image'}
                        onPress={handleImageUpload}
                    />
                    <InputField
                        label="Name"
                        placeholder="The name of your menu item"
                        onChangeText={(input) => {
                            setNewMenuItem((prev) => ({
                                ...prev,
                                name: input,
                            }));
                        }}
                        value={newMenuItem.name}
                    />
                    <InputField
                        label="Price"
                        placeholder="The price of your menu item"
                        keyboardType="name-phone-pad"
                        onChangeText={(input) => {
                            const cleanInput = input.replace(/[^0-9.]/g, '');

                            if (!cleanInput) {
                                setNewMenuItem((prev) => ({
                                    ...prev,
                                    price: 0,
                                }));
                                return;
                            }

                            const number = parseFloat(cleanInput);

                            // Only update if we have a valid number
                            if (!isNaN(number)) {
                                const formattedNumber = parseFloat(
                                    number.toFixed(2)
                                );
                                setNewMenuItem((prev) => ({
                                    ...prev,
                                    price: formattedNumber,
                                }));
                            }
                        }}
                        value={newMenuItem.price.toString()}
                    />
                    <InputField
                        label="Quantity"
                        placeholder="The quantity of your menu item"
                        keyboardType="number-pad"
                        inputMode="numeric"
                        onChangeText={(input) => {
                            const cleanInput = input.replace(/[^0-9.]/g, '');

                            if (!cleanInput) {
                                setNewMenuItem((prev) => ({
                                    ...prev,
                                    quantity: 0,
                                }));
                                return;
                            }

                            const number = parseFloat(cleanInput);

                            // Only update if we have a valid number
                            if (!isNaN(number)) {
                                const formattedNumber = parseFloat(
                                    number.toFixed(2)
                                );
                                setNewMenuItem((prev) => ({
                                    ...prev,
                                    quantity: formattedNumber,
                                }));
                            }
                        }}
                        value={newMenuItem.quantity?.toString()}
                    />
                    <Button
                        label="Create Item"
                        onPress={() => {
                            handleAddItem();
                        }}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
