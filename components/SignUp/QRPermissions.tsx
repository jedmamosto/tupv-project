import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '../custom/Button';
import { useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { QRScannerScreenNavigationProp } from '@/types/navigations';

interface QRPermissionsProps {
    onModalStateChange: (state: boolean) => void;
    onScanComplete: (scannedId: string) => void;
}

const QRPermissions = ({
    onModalStateChange,
    onScanComplete,
}: QRPermissionsProps) => {
    const navigation = useNavigation<QRScannerScreenNavigationProp>();
    const [permission, requestPermission] = useCameraPermissions();
    const isPermissionGranted = Boolean(permission?.granted);

    const handleSuccessfulScan = (scannedData: string) => {
        onScanComplete(scannedData);
        onModalStateChange(false);
    };

    return (
        <SafeAreaView className="flex-1">
            <View className="items-center gap-6 p-6">
                <Text className="text-2xl font-semibold">
                    Scan Your ID QR Code
                </Text>
                <Button
                    label="Go back"
                    onPress={() => onModalStateChange(false)}
                    type="secondary"
                    pressableClassName="mb-4"
                />
                <Button
                    label="Request Camera Access"
                    onPress={requestPermission}
                    pressableClassName="mb-4"
                />
                {isPermissionGranted && (
                    <Button
                        label="Scan QR Code"
                        onPress={() => {
                            onModalStateChange(false);
                            navigation.navigate('QRScanner', {
                                onScanComplete: handleSuccessfulScan,
                            });
                        }}
                        type="primary"
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

export default QRPermissions;
