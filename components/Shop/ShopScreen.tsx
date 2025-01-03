import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import MenuItemList from "./MenuItemList";
import { Shop, MenuItem } from "../../types/shop";
import { mockShops } from "../../data/mockData";
import { ArrowLeft } from "react-native-feather";

interface ShopScreenProps {
  shopId: string;
  onClose: () => void;
}

export default function ShopScreen({ shopId, onClose }: ShopScreenProps) {
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const foundShop = mockShops.find((s) => s.id === shopId);
        if (foundShop) {
          setShop(foundShop);
          setMenuItems(
            foundShop.menuItems.map((item) => ({ ...item, quantity: 0 }))
          );
        }
      } catch (error) {
        console.error("Error fetching shop:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [shopId]);

  function handleUpdateQuantity(itemId: string, quantity: number) {
    if (quantity < 0) return;
    setMenuItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  }

  function handleAddToCart(item: MenuItem) {
    console.log("Adding to cart:", item);
  }

  if (loading) {
    return (
      <View className="flex-1 bg-light justify-center items-center">
        <StatusBar barStyle="light-content" backgroundColor="#3d5300" />
        <ActivityIndicator size="large" color="#3d5300" />
        <Text className="text-primary mt-4">Loading menu...</Text>
      </View>
    );
  }

  if (!shop) {
    return (
      <View className="flex-1 bg-light justify-center items-center">
        <StatusBar barStyle="light-content" backgroundColor="#3d5300" />
        <Text className="text-danger">Shop not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-light">
      <StatusBar barStyle="light-content" backgroundColor="#3d5300" />
      <View className="bg-primary pt-12 pb-4 px-4 flex-row items-center">
        <TouchableOpacity onPress={onClose} className="mr-4">
          <ArrowLeft stroke="#fff" width={24} height={24} />
        </TouchableOpacity>
        <Text className="text-light text-lg font-medium">{shop.name}</Text>
      </View>

      <ScrollView className="flex-1">
        {menuItems.map((item) => (
          <MenuItemList
            key={item.id}
            item={item}
            onUpdateQuantity={handleUpdateQuantity}
            onAddToCart={handleAddToCart}
          />
        ))}
      </ScrollView>
    </View>
  );
}
