import React, { useState, useEffect } from "react";
import { View, ScrollView, ActivityIndicator, Text, StatusBar, SafeAreaView } from "react-native";
import BottomNav from "../../components/Home/BottomNav";
import { mockShops } from "../../data/mockData";
import type { Shop } from "../../types/shop";
import HomeShopCard from "../../components/Home/HomeShopCard";
import { HomeScreenProps } from "../../types/navigations";

function HomeScreen({ navigation }: HomeScreenProps) {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<"home" | "cart" | "profile">(
    "home"
  );

  useEffect(function () {
    function fetchShops() {
      try {
        setTimeout(function () {
          setShops(mockShops);
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error("Error fetching shops:", error);
        setLoading(false);
      }
    }

    fetchShops();
  }, []);

  function handleShopPress(shopId: string) {
    console.log("Navigating to Shop with shopId:", shopId);
    navigation.navigate("Shop", { shopId });
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
    <SafeAreaView className="flex-1 bg-light">
      <StatusBar barStyle='default'/>
      {currentTab === "home" && (
        <ScrollView className="flex-1 pt-8 px-4 pb-4">
          <Text className="text-2xl font-extrabold italic text-primary mb-6">
            Check us out!
          </Text>
          {shops.map(function (shop) {
            return (
              <HomeShopCard
                key={shop.id}
                shop={shop}
                onShopPress={handleShopPress}
                onItemPress={handleItemPress}
              />
            );
          })}
        </ScrollView>
      )}
      {currentTab === "cart" && (
        <View className="flex-1 justify-center items-center">
          <Text className="text-primary text-lg">Cart Coming Soon</Text>
        </View>
      )}
      {currentTab === "profile" && (
        <View className="flex-1 justify-center items-center">
          <Text className="text-primary text-lg">Profile Coming Soon</Text>
        </View>
      )}
      <BottomNav currentTab={currentTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

export default HomeScreen;
