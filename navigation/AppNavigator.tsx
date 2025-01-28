import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen';
import ShopScreen from '../screens/Shop/ShopScreen';
import CartScreen from '../screens/Cart/CartScreen';
import CheckoutScreen from '../screens/Checkout/CheckoutScreen';
import LoginScreen from '@/screens/Login/LoginScreen';
import SignUpScreen from '@/screens/SignUp/SignUpScreen';
import QRScannerScreen from '@/screens/QRScanner/QRScannerScreen';
import VendorDashboardScreen from '@/screens/Vendor/VendorDashboard';
import ManageInventoryScreen from '@/screens/Vendor/ManageInventory';
import ManageOrdersScreen from '@/screens/Vendor/ManageOrders';
import ScanQRScreen from '@/screens/Vendor/ScanQR';
import type { RootStackParamList } from '../types/navigations';

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Shop" component={ShopScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="QRScanner" component={QRScannerScreen} />
            <Stack.Screen
                name="VendorDashboard"
                component={VendorDashboardScreen}
            />
            <Stack.Screen
                name="ManageInventory"
                component={ManageInventoryScreen}
            />
            <Stack.Screen name="ManageOrders" component={ManageOrdersScreen} />
            <Stack.Screen name="ScanQR" component={ScanQRScreen} />
            {/* <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} /> */}
            {/* <Stack.Screen name="PaymentGateway" component={PaymentGatewayScreen} /> */}
            {/* <Stack.Screen name="UserProfile" component={UserProfileScreen} /> */}
        </Stack.Navigator>
    );
}

export default AppNavigator;
