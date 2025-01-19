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

  useEffect(function () {
    fetchOrderItems();
  }, []);

  function fetchOrderItems() {
    setTimeout(function () {
      setOrderItems(mockOrderItems);
      setLoading(false);
    }, 1000);
  }

  function calculateTotal() {
    return orderItems.reduce(function (sum, item) {
      return sum + item.price * (item.quantity || 0);
    }, 0);
  }

  function handlePaymentSelection(paymentId: string) {
    setSelectedPayment(paymentId);
  }

  function handlePlaceOrder() {
    if (!selectedPayment) return;
    setPlacingOrder(true);
    setTimeout(function () {
      setPlacingOrder(false);
      navigation.navigate("Home");
    }, 2000);
  }

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f8f9fa",
        }}
      >
        <ActivityIndicator size="large" color="#3d5300" />
        <Text style={{ marginTop: 16, color: "#3d5300" }}>
          Loading checkout...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
      <View
        style={{
          backgroundColor: "#3d5300",
          paddingTop: 48,
          paddingBottom: 16,
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginRight: 16 }}
        >
          <ArrowLeft stroke="#fff" width={24} height={24} />
        </TouchableOpacity>
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
          Checkout
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }}>
        <View
          style={{
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: "#e0e0e0",
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#3d5300" }}>
            Nenang's Eatery
          </Text>
        </View>

        <View style={{ padding: 16, backgroundColor: "#f0f0f0" }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#3d5300",
              marginBottom: 8,
            }}
          >
            Order Summary
          </Text>
          {orderItems.map(function (item) {
            return (
              <View
                key={item.id}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Text style={{ fontSize: 16, color: "#3d5300" }}>
                  {item.quantity} × {item.name}
                </Text>
                <Text style={{ fontSize: 16, color: "#3d5300" }}>
                  ₱{(item.price * (item.quantity || 0)).toFixed(2)}
                </Text>
              </View>
            );
          })}
          <View
            style={{
              marginTop: 16,
              paddingTop: 16,
              borderTopWidth: 1,
              borderTopColor: "#d0d0d0",
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: "#3d5300" }}
              >
                TOTAL
              </Text>
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: "#3d5300" }}
              >
                ₱{calculateTotal().toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ padding: 16 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#3d5300",
              marginBottom: 8,
            }}
          >
            Payment Method
          </Text>
          {mockPaymentMethods.map(function (method) {
            return (
              <TouchableOpacity
                key={method.id}
                onPress={() => handlePaymentSelection(method.id)}
                style={{
                  padding: 16,
                  borderRadius: 8,
                  borderWidth: 2,
                  borderColor:
                    selectedPayment === method.id ? "#3d5300" : "#e0e0e0",
                  backgroundColor:
                    selectedPayment === method.id ? "#f0f8ff" : "transparent",
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: selectedPayment === method.id ? "#3d5300" : "#666",
                    fontWeight:
                      selectedPayment === method.id ? "bold" : "normal",
                  }}
                >
                  {method.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View
        style={{ padding: 16, borderTopWidth: 1, borderTopColor: "#e0e0e0" }}
      >
        <TouchableOpacity
          onPress={handlePlaceOrder}
          disabled={!selectedPayment || placingOrder}
          style={{
            backgroundColor:
              selectedPayment && !placingOrder ? "#3d5300" : "#a0a0a0",
            padding: 16,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          {placingOrder ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
              Place Order
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default CheckoutScreen;
