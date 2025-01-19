import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Button } from '../custom/Button';
import { useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { QRScannerScreenNavigationProp } from '@/types/navigations';

interface QRPermissionsProps {
    onModalStateChange: (state: boolean) => void;
}

const QRPermissions = ({ onModalStateChange }: QRPermissionsProps) => {
    const navigation = useNavigation<QRScannerScreenNavigationProp>();

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
                    onPress={() => {
                        onModalStateChange(false);
                        console.log(isPermissionGranted);
                        navigation.navigate('QRScanner');
                    }}
                >
                    <Text>Scan Code</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

export default QRPermissions;
