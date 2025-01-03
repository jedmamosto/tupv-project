import React, { useState, useEffect } from "react";
import { View, ScrollView, ActivityIndicator, Text } from "react-native";
import ShopCard from "../../components/Home/ShopCard";
import BottomNav from "../../components/Home/BottomNav";
import { mockShops } from "../../data/mockConcessionaires";
import { Shop } from "../../types/shop";

export default function HomeScreen() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<"home" | "cart" | "profile">(
    "home"
  );

  useEffect(() => {
    const fetchShops = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setShops(mockShops);
      } catch (error) {
        console.error("Error fetching shops:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  function handleShopPress(shopId: string) {
    console.log(`Navigate to shop: ${shopId}`);
  }

  function handleItemPress(shopId: string, itemId: string) {
    console.log(`Navigate to item: ${itemId} in shop: ${shopId}`);
  }

  function handleTabPress(tab: "home" | "cart" | "profile") {
    setCurrentTab(tab);
  }

  if (loading) {
    return (
      <View className="flex-1 bg-light justify-center items-center">
        <ActivityIndicator size="large" color="#3d5300" />
        <Text className="text-primary mt-4">Loading shops...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-light">
      <ScrollView className="flex-1 px-4 pt-10 pb-4">
        {shops.map((shop) => (
          <ShopCard
            key={shop.id}
            shop={shop}
            onShopPress={handleShopPress}
            onItemPress={handleItemPress}
          />
        ))}
      </ScrollView>
      <BottomNav currentTab={currentTab} onTabPress={handleTabPress} />
    </View>
  );
}
