import React, { useState } from 'react';
import { View, Text, Modal } from 'react-native';
import { Button } from '../custom/Button';
import { useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import QRScannerModal from './QRScannerModal';

interface QRPermissionsModalProps {
    onModalStateChange: (state: boolean) => void;
    onScanComplete: (scannedId: string) => void;
}

const QRPermissionsModal = ({
    onModalStateChange,
    onScanComplete,
}: QRPermissionsModalProps) => {
    const [permission, requestPermission] = useCameraPermissions();
    const isPermissionGranted = Boolean(permission?.granted);
    const [isScannerModalVisible, setIsScannerModalVisible] = useState(false);

    const handleSuccessfulScan = (scannedData: string) => {
        setIsScannerModalVisible(false);

        setTimeout(() => {
            onScanComplete(scannedData);
            onModalStateChange(false);
        }, 500);
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
                {!isPermissionGranted && (
                    <Button
                        label="Request Camera Access"
                        onPress={requestPermission}
                        pressableClassName="mb-4"
                    />
                )}
                {isPermissionGranted && (
                    <Button
                        label="Scan QR Code"
                        onPress={() => {
                            setIsScannerModalVisible(true);
                        }}
                        type="primary"
                    />
                )}
            </View>
            <Modal
                visible={isScannerModalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setIsScannerModalVisible(false)}
            >
                <QRScannerModal
                    onScanComplete={handleSuccessfulScan}
                    onScannerModalStateChange={setIsScannerModalVisible}
                />
            </Modal>
        </SafeAreaView>
    );
};

export default QRPermissionsModal;
