import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, Text, StatusBar, SafeAreaView, RefreshControl } from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import BottomNav, { type TabType } from "@/components/Home/BottomNav";
import { mockShops } from "@/data/mockData";
import type { Shop } from "@/types/shop";
import HomeShopCard from "@/components/Home/HomeShopCard";
import { Button } from "@/components/custom/Button";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useAuth } from "@/contexts/AuthContext";

function HomeScreen() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTab, setCurrentTab] = useState<TabType>("home");
  const { user } = useAuth();

  async function fetchShops() {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setShops(mockShops);
    } catch (error) {
      console.error("Error fetching shops:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchShops();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchShops().then(() => setRefreshing(false));
  }, []);

  function handleShopPress(shopId: string) {
    router.push({
      pathname: "/(customer)/shop/[shopId]",
      params: { shopId: shopId },
    });
  }

  function handleItemPress(shopId: string, itemId: string) {
    console.log(`Navigate to item: ${itemId} in shop: ${shopId}`);
  }

  function handleTabPress(tab: TabType) {
    setCurrentTab(tab);
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-light">
        <ActivityIndicator size="large" color="#3d5300" />
        <Animated.Text entering={FadeInDown} exiting={FadeOutDown} className="mt-4 text-primary">
          Loading shops...
        </Animated.Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#f8f9fa]">
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      {currentTab === "home" && (
        <Animated.ScrollView
          className="flex-1 px-4 pb-4 pt-8"
          entering={FadeInDown.duration(500)}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <Animated.Text
            className="mb-6 text-3xl font-extrabold italic text-primary text-left border-b border-gray-300 pb-2 mt-3"
            entering={FadeInDown.delay(200)}
          >
            Check us out!
          </Animated.Text>
          {shops.map((shop, index) => (
            <Animated.View key={shop.id} entering={FadeInDown.delay(300 + index * 100)}>
              <HomeShopCard shop={shop} onShopPress={handleShopPress} onItemPress={handleItemPress} />
            </Animated.View>
          ))}
        </Animated.ScrollView>
      )}
      {currentTab === "cart" && (
        <Animated.View className="flex-1 items-center justify-center" entering={FadeInDown.duration(500)}>
          <Text className="text-lg text-primary">Cart Coming Soon</Text>
        </Animated.View>
      )}
      {currentTab === "profile" && (
        <Animated.View className="flex-1 items-center justify-center gap-6" entering={FadeInDown.duration(500)}>
          <Text className="text-lg text-primary">Profile Options</Text>
          {user ? (
            <Button pressableClassName="w-fit px-4" label="Sign Out" onPress={() => signOut(auth)} />
          ) : (
            <Button pressableClassName="w-fit px-4" label="Login" onPress={() => router.push("/(auth)/login")} />
          )}
        </Animated.View>
      )}
      <BottomNav currentTab={currentTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

export default HomeScreen;
