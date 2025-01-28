import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';

export default function App() {
    return (
        <View className="flex-1 items-center justify-center bg-gray-100">
            <Text className="">Hello, world!</Text>
            <Link href="/(customer)/home" asChild>
                <Pressable>
                    <Text>GO TO HOME</Text>
                </Pressable>
            </Link>
        </View>
    );
}
