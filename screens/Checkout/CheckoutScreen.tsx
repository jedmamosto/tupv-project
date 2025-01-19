import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigations";
import { ArrowLeft } from "react-native-feather";
import {
  mockOrderItems,
  mockPaymentMethods,
} from "../../data/checkoutMockData";
import { MenuItem } from "../../types/shop";

type CheckoutScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Checkout"
>;

interface CheckoutScreenProps {
  navigation: CheckoutScreenNavigationProp;
}

function CheckoutScreen({ navigation }: CheckoutScreenProps) {
  const [orderItems, setOrderItems] = useState<MenuItem[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    fetchOrderItems();
  }, []);

  function fetchOrderItems() {
    setTimeout(() => {
      setOrderItems(mockOrderItems);
      setLoading(false);
    }, 1000);
  };

  const calculateTotal = () =>
    orderItems.reduce((sum, item) => sum + item.price * (item.quantity || 0), 0);

  function handlePaymentSelection(paymentId: string) {
    setSelectedPayment(paymentId);
  };

 function handlePlaceOrder() {
    if (!selectedPayment) return;
    setPlacingOrder(true);
    setTimeout(() => {
      setPlacingOrder(false);
      navigation.navigate("Home");
    }, 2000);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#3d5300" />
        <Text className="mt-4 text-green-800">Loading checkout...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="bg-green-800 pt-12 pb-4 px-4 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ArrowLeft stroke="#fff" width={24} height={24} />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">Checkout</Text>
      </View>

      <ScrollView className="flex-1">
        <View className="p-4 border-b border-gray-300">
          <Text className="text-xl font-bold text-green-800">Nenang's Eatery</Text>
        </View>

        <View className="p-4 bg-gray-200">
          <Text className="text-lg font-bold text-green-800 mb-2">
            Order Summary
          </Text>
          {orderItems.map((item) => (
            <View
              key={item.id}
              className="flex-row justify-between mb-2"
            >
              <Text className="text-base text-green-800">
                {item.quantity} × {item.name}
              </Text>
              <Text className="text-base text-green-800">
                ₱{(item.price * (item.quantity || 0)).toFixed(2)}
              </Text>
            </View>
          ))}
          <View className="mt-4 pt-4 border-t border-gray-400">
            <View className="flex-row justify-between">
              <Text className="text-lg font-bold text-green-800">TOTAL</Text>
              <Text className="text-lg font-bold text-green-800">
                ₱{calculateTotal().toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <View className="p-4">
          <Text className="text-lg font-bold text-green-800 mb-2">
            Payment Method
          </Text>
          {mockPaymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => handlePaymentSelection(method.id)}
              className={`p-4 rounded-lg border-2 mb-2 ${
                selectedPayment === method.id
                  ? "border-green-800 bg-blue-50"
                  : "border-gray-300"
              }`}
            >
              <Text
                className={`text-base ${
                  selectedPayment === method.id
                    ? "text-green-800 font-bold"
                    : "text-gray-600"
                }`}
              >
                {method.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View className="p-4 border-t border-gray-300">
        <TouchableOpacity
          onPress={handlePlaceOrder}
          disabled={!selectedPayment || placingOrder}
          className={`p-4 rounded-lg items-center ${
            selectedPayment && !placingOrder
              ? "bg-green-800"
              : "bg-gray-400"
          }`}
        >
          {placingOrder ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-lg font-bold">Place Order</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default CheckoutScreen;
