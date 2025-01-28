import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { CartItem } from '../shop';

export type RootStackParamList = {
    Home: undefined;
    Shop: { shopId: string };
    Cart: { cartItems: CartItem[]; shopId: string };
    Checkout: { cartItems: CartItem[]; shopId: string };
    OrderConfirmation: { orderId: string };
    Login: undefined;
    SignUp: undefined;
    QRScanner: undefined;
    UserProfile: { userId: string };
    OrderHistory: undefined;
    PaymentGateway: { amount: number; orderId: string };
    VendorDashboard: undefined;
    ManageInventory: undefined;
    ManageOrders: undefined;
    ScanQR: undefined;
};

export type HomeScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Home'
>;
export type ShopScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Shop'
>;
export type CartScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Cart'
>;
export type CheckoutScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Checkout'
>;
export type OrderConfirmationScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'OrderConfirmation'
>;
export type LoginScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Login'
>;
export type SignUpScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'SignUp'
>;
export type QRScannerScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'QRScanner'
>;
export type UserProfileScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'UserProfile'
>;
export type OrderHistoryScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'OrderHistory'
>;
export type PaymentGatewayScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'PaymentGateway'
>;
export type VendorDashboardScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'VendorDashboard'
>;
export type ManageInventoryScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'ManageInventory'
>;
export type ManageOrdersScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'ManageOrders'
>;
export type ScanQRScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'ScanQR'
>;

export type ShopScreenRouteProp = RouteProp<RootStackParamList, 'Shop'>;
export type CartScreenRouteProp = RouteProp<RootStackParamList, 'Cart'>;
export type CheckoutScreenRouteProp = RouteProp<RootStackParamList, 'Checkout'>;
export type OrderConfirmationScreenRouteProp = RouteProp<
    RootStackParamList,
    'OrderConfirmation'
>;
export type UserProfileScreenRouteProp = RouteProp<
    RootStackParamList,
    'UserProfile'
>;
export type PaymentGatewayScreenRouteProp = RouteProp<
    RootStackParamList,
    'PaymentGateway'
>;

export interface HomeScreenProps {
    navigation: HomeScreenNavigationProp;
}

export interface ShopScreenProps {
    navigation: ShopScreenNavigationProp;
    route: ShopScreenRouteProp;
}

export interface CartScreenProps {
    navigation: CartScreenNavigationProp;
    route: CartScreenRouteProp;
}

export interface CheckoutScreenProps {
    navigation: CheckoutScreenNavigationProp;
    route: CheckoutScreenRouteProp;
}

export interface OrderConfirmationScreenProps {
    navigation: OrderConfirmationScreenNavigationProp;
    route: OrderConfirmationScreenRouteProp;
}

export interface LoginScreenProps {
    navigation: LoginScreenNavigationProp;
}

export interface SignUpScreenProps {
    navigation: SignUpScreenNavigationProp;
}

export interface QRScannerScreenProps {
    navigation: QRScannerScreenNavigationProp;
}

export interface UserProfileScreenProps {
    navigation: UserProfileScreenNavigationProp;
    route: UserProfileScreenRouteProp;
}

export interface OrderHistoryScreenProps {
    navigation: OrderHistoryScreenNavigationProp;
}

export interface PaymentGatewayScreenProps {
    navigation: PaymentGatewayScreenNavigationProp;
    route: PaymentGatewayScreenRouteProp;
}

export interface VendorDashboardScreenProps {
    navigation: VendorDashboardScreenNavigationProp;
}

export interface ManageInventoryScreenProps {
    navigation: ManageInventoryScreenNavigationProp;
}

export interface ManageOrdersScreenProps {
    navigation: ManageOrdersScreenNavigationProp;
}

export interface ScanQRScreenProps {
    navigation: ScanQRScreenNavigationProp;
}
