import React from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    StatusBar,
    Platform,
} from 'react-native';
import { ArrowLeft } from 'react-native-feather';
import type { ScanQRScreenProps } from '../../types/navigations';

export default function ScanQR({ navigation }: ScanQRScreenProps) {
    return (
        <SafeAreaView className="flex-1 bg-light">
            <StatusBar barStyle="default" />
            <View
                className={`flex-1 ${Platform.OS === 'android' ? 'mt-8' : ''}`}
            >
                <View className="flex-row items-center bg-primary px-4 py-4">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="mr-4"
                    >
                        <ArrowLeft stroke="#fff" width={24} height={24} />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-white">
                        Scan QR
                    </Text>
                </View>

                <View className="flex-1 items-center justify-center p-4">
                    <Text className="text-center text-lg text-primary">
                        QR Scanner functionality will be implemented soon.
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}
