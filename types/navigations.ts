import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";

export type RootStackParamList = {
  Home: undefined;
  Shop: { shopId: string };
  Checkout: undefined;
};

export type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

export type ShopScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Shop"
>;
export type ShopScreenRouteProp = RouteProp<RootStackParamList, "Shop">;

export type CheckoutScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Checkout"
>;

export interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export interface ShopScreenProps {
  navigation: ShopScreenNavigationProp;
  route: ShopScreenRouteProp;
}

export interface CheckoutScreenProps {
  navigation: CheckoutScreenNavigationProp;
}
