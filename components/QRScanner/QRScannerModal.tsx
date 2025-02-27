import { CameraView, useCameraPermissions } from 'expo-camera';
import {
    StatusBar,
    Text,
    SafeAreaView,
    View,
    useWindowDimensions,
} from 'react-native';
import { Button } from '@/components/custom/Button';
import { useState } from 'react';

interface QRScannerModalProps {
    onScanComplete: (scannedId: string) => void;
    onScannerModalStateChange: (state: boolean) => void;
}

const QRScannerModal = ({
    onScanComplete,
    onScannerModalStateChange,
}: QRScannerModalProps) => {
    const [permission, requestPermission] = useCameraPermissions();
    const { width, height } = useWindowDimensions();
    const [error, setError] = useState('');

    // Function to handle successful QR scan
    const handleQRScanned = ({ data }: { data: string }) => {
        const idPattern = /^TUPV-[0-9]{2}-[0-9]{4}$/;
        const formattedData = data.toUpperCase();
        if (idPattern.test(formattedData)) {
            setTimeout(() => {
                onScanComplete(formattedData);
            }, 1000);
        } else {
            setError('Invalid QR code format. Please try again.');
            setTimeout(() => {
                setError('');
            }, 3000);
        }
    };

    if (!permission) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text>Loading camera permissions...</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View className="flex-1 items-center justify-center p-4">
                <Text className="mb-4 text-center">
                    We need your permission to use the camera for QR scanning
                </Text>
                <Button
                    label="Grant Permission"
                    onPress={requestPermission}
                    type="primary" // Using the custom Button type prop
                />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-black">
            <StatusBar barStyle="light-content" />
            <View className="flex-1">
                <CameraView
                    style={{
                        width: width,
                        height: height,
                        position: 'absolute',
                    }}
                    active={true}
                    facing="back"
                    onBarcodeScanned={handleQRScanned}
                />

                {/* Overlay Container */}
                <View className="flex-1">
                    {/* Top Section */}
                    <View className="flex-1 bg-black/50">
                        <View className="flex-1 items-center justify-end pb-4">
                            <Text className="text-lg font-semibold text-white">
                                Scan QR Code
                            </Text>
                            <Text className="mt-2 text-sm text-white/80">
                                Align QR code within the frame
                            </Text>
                        </View>
                    </View>

                    {/* Middle Section with Scanner Frame */}
                    <View className="h-72 flex-row">
                        <View className="flex-1 bg-black/50" />
                        <View className="h-72 w-72">
                            {/* Corner Markers */}
                            <View className="absolute left-0 top-0 h-20 w-20 border-l-4 border-t-4 border-white" />
                            <View className="absolute right-0 top-0 h-20 w-20 border-r-4 border-t-4 border-white" />
                            <View className="absolute bottom-0 left-0 h-20 w-20 border-b-4 border-l-4 border-white" />
                            <View className="absolute bottom-0 right-0 h-20 w-20 border-b-4 border-r-4 border-white" />

                            {/* Scanning Animation Line */}
                            <View className="absolute left-0 right-0 top-0 h-0.5 bg-white/80" />
                        </View>
                        <View className="flex-1 bg-black/50" />
                    </View>

                    {/* Bottom Section */}
                    <View className="flex-1 bg-black/50">
                        <View className="flex-1 items-center justify-start pt-8">
                            <View className="flex-row items-center space-x-2">
                                <Text className="text-white">
                                    Keep it centered
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View className="absolute bottom-8 w-full items-center">
                    <Button
                        label="Cancel"
                        onPress={() => onScannerModalStateChange(false)}
                        type="secondary" // Using the custom Button type prop
                        pressableClassName="bg-white/20"
                    />
                </View>
            </View>
            <View className="absolute top-8 w-full items-center">
                {error && (
                    <Text className="rounded-lg bg-red-500/80 px-4 py-2 text-white">
                        {error}
                    </Text>
                )}
            </View>
        </SafeAreaView>
    );
};

export default QRScannerModal;
