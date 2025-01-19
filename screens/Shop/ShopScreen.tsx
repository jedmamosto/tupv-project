import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import MenuItemList from "../../components/Shop/MenuItemList";
import { Shop, MenuItem } from "../../types/shop";
import { mockShops } from "../../data/mockData";
import { ArrowLeft } from "react-native-feather";
import { ShopScreenProps } from "../../types/navigations";

function ShopScreen({ route, navigation }: ShopScreenProps) {
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const { shopId } = route.params;

  useEffect(() => {
    const foundShop = mockShops.find((s) => s.id === shopId);
    if (foundShop) {
      setShop(foundShop);
      setMenuItems(
        foundShop.menuItems.map((item) => ({ ...item, quantity: 0 }))
      );
    }
    setLoading(false);
  }, [shopId]);

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 0) return;
    setMenuItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const handleAddToCart = (item: MenuItem) => {
    console.log("Adding to cart:", item);
  };

  const handleCheckout = () => {
    navigation.navigate("Checkout");
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <StatusBar barStyle="light-content" backgroundColor="#3d5300" />
        <ActivityIndicator size="large" color="#3d5300" />
        <Text className="mt-4 text-green-800">Loading menu...</Text>
      </View>
    );
  }

  if (!shop) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <StatusBar barStyle="light-content" backgroundColor="#3d5300" />
        <Text className="text-red-500">Shop not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar barStyle="light-content" backgroundColor="#3d5300" />
      <View className="bg-green-800 pt-12 pb-4 px-4 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ArrowLeft stroke="#fff" width={24} height={24} />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">{shop.name}</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {menuItems.map((item) => (
          <MenuItemList
            key={item.id}
            item={item}
            onUpdateQuantity={handleUpdateQuantity}
            onAddToCart={handleAddToCart}
          />
        ))}
      </ScrollView>

      <TouchableOpacity
        onPress={handleCheckout}
        className="bg-green-800 p-4 items-center justify-center"
      >
        <Text className="text-white text-lg font-bold">Checkout</Text>
      </TouchableOpacity>
    </View>
  );
}

export default ShopScreen;
