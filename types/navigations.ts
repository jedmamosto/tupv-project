import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";

export type RootStackParamList = {
  Home: undefined;
  Shop: { shopId: string };
  Login: undefined;
  SignUp: undefined;
  QRScanner: undefined;
};

export type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;
export type ShopScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Shop"
>;
export type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;
export type SignUpScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SignUp"
>;
export type QRScannerScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'QRScanner'
>;

export type ShopScreenRouteProp = RouteProp<RootStackParamList, "Shop">;


export interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export interface ShopScreenProps {
  navigation: ShopScreenNavigationProp;
  route: ShopScreenRouteProp;
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
