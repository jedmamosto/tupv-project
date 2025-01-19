import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen';
import ShopScreen from '../screens/Shop/ShopScreen';
import { RootStackParamList } from '../types/navigations';
import LoginScreen from '@/screens/Login/LoginScreen';
import SignUpScreen from '@/screens/SignUp/SignUpScreen';
import QRScannerScreen from '@/screens/QRScanner/QRScannerScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Shop" component={ShopScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="QRScanner" component={QRScannerScreen} />
        </Stack.Navigator>
    );
}

export default AppNavigator;
