import React from "react";
import { View, Text, Image, TouchableOpacity, Pressable } from "react-native";
import { Shop } from "../../types/shop";

interface ShopCardProps {
  shop: Shop;
  onShopPress: (shopId: string) => void;
  onItemPress: (shopId: string, itemId: string) => void;
}

export default function ShopCard({
  shop,
  onShopPress,
  onItemPress,
}: ShopCardProps) {
  return (
    <View className="bg-light rounded-2xl shadow-md mb-4 overflow-hidden">
      <Image
        source={
          typeof shop.coverImage === "string"
            ? { uri: shop.coverImage }
            : shop.coverImage
        }
        resizeMode="cover"
        className="w-full h-40"
      />

      <View className="p-4">
        <Text className="text-xl font-bold text-primary mb-4">{shop.name}</Text>

        <View className="flex-row flex-wrap justify-between mb-4">
          {shop.featuredItems.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => onItemPress(shop.id, item.id)}
              className="w-[48%] mb-2"
            >
              <Image
                source={
                  typeof item.image === "string"
                    ? { uri: item.image }
                    : item.image
                }
                className="w-full h-24 rounded-lg"
                resizeMode="cover"
              />
            </Pressable>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => onShopPress(shop.id)}
          className="bg-primary py-3 rounded-lg items-center"
        >
          <Text className="text-light font-semibold">Visit Shop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
