import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Shop } from "../../types/shop";
import { Image } from "expo-image";

interface ShopCardProps {
  shop: Shop;
  onShopPress: (shopId: string) => void;
  onItemPress: (shopId: string, itemId: string) => void;
}

export default function HomeShopCard({
  shop,
  onShopPress,
  onItemPress,
}: ShopCardProps) {
  return (
    <View className="bg-light rounded-2xl shadow-md border border-gray-200 mb-4 overflow-hidden">
      <Image
        source={
          typeof shop.coverImage === "string"
            ? { uri: shop.coverImage }
            : shop.coverImage
        }
        style={{width: '100%', height: 160}}
        contentFit="cover"
      />

      <View className="p-4">
        <Text className="text-xl font-bold text-primary mb-4">{shop.name}</Text>


        <TouchableOpacity
          onPress={() => onShopPress(shop.id)}
          className="bg-primary py-3 rounded-lg items-center justify-center"
        >
          <Text className="text-light font-semibold">Visit Shop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
