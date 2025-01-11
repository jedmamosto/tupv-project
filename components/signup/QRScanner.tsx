import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Button } from '../custom/Button';
import { useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';

interface QRScannerProps {
    onModalStateChange: (state: boolean) => void;
}

const QRScanner = ({ onModalStateChange }: QRScannerProps) => {
    const [permission, requestPermission] = useCameraPermissions();

    const isPermissionGranted = Boolean(permission?.granted);

    return (
        <SafeAreaView className="flex-1">
            <View className="items-center gap-6 p-6">
                <Text className="text-2xl font-semibold">
                    Scan Your ID QR Code
                </Text>
                <Button
                    pressableClassName=""
                    type=""
                    label="Go back"
                    onPress={() => onModalStateChange(false)}
                />
                <Pressable onPress={requestPermission}>
                    <Text>Request Permissions</Text>
                </Pressable>
                <Pressable
                    disabled={!isPermissionGranted}
                    onPress={() => console.log('Scan Code button is pressed')}
                >
                    <Text>Scan Code</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

export default QRScanner;
