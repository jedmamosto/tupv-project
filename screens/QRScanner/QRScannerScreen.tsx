import { CameraView, useCameraPermissions } from 'expo-camera';
import {
    StatusBar,
    Text,
    SafeAreaView,
    Button,
    View,
    Dimensions,
} from 'react-native';

interface QRScannerScreenProps {
    onScan: (data: string) => void;
}

const QRScannerScreen = () => {
    const [permission, requestPermission] = useCameraPermissions();
    // Get the device screen dimensions to set proper camera size
    const { width, height } = Dimensions.get('window');

    if (!permission) {
        // Camera permissions are still loading
        return (
            <View className="flex-1 items-center justify-center">
                <Text>Loading camera permissions...</Text>
            </View>
        );
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
            <View className="flex-1 items-center justify-center p-4">
                <Text className="mb-4 text-center">
                    We need your permission to use the camera for QR scanning
                </Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-black">
            <StatusBar barStyle="light-content" />

            {/* Camera View */}
            <View className="flex-1">
                <CameraView
                    style={{
                        width: width,
                        height: height,
                        position: 'absolute',
                    }}
                    active={true}
                    facing="back"
                    onBarcodeScanned={({ data }) => {
                        console.log('Scanned data:', data);
                    }}
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
            </View>
        </SafeAreaView>
    );
};

export default QRScannerScreen;
