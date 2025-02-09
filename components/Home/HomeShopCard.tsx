import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import type { Shop } from "../../types/shop";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;

interface ShopCardProps {
  shop: Shop;
  onShopPress: (shopId: string) => void;
  onItemPress: (shopId: string, itemId: string) => void;
}

export default function HomeShopCard({ shop, onShopPress, onItemPress }: ShopCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  function handlePressIn() {
    scale.value = withSpring(0.95);
  }

  function handlePressOut() {
    scale.value = withSpring(1);
  }

  return (
    <Animated.View style={[animatedStyle]} className="bg-white rounded-3xl shadow-lg mb-6 overflow-hidden">
      <TouchableOpacity
        onPress={() => onShopPress(shop.id)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <Image
          source={typeof shop.coverImage === "string" ? { uri: shop.coverImage } : shop.coverImage}
          style={{ width: "100%", height: isTablet ? 240 : 180 }}
          contentFit="cover"
        />
        <LinearGradient
          colors={["rgba(0,0,0,0.6)", "transparent"]}
          style={{ position: "absolute", left: 0, right: 0, top: 0, height: "100%" }}
        />
        <View className="absolute top-0 left-0 right-0 p-4">
          <Text className="text-2xl font-bold text-white mb-2">{shop.name}</Text>
          <Text className="text-white text-sm mb-4">{shop.description}</Text>
        </View>
        <View className="p-4">
          <TouchableOpacity
            onPress={() => onShopPress(shop.id)}
            className="bg-primary py-3 rounded-full items-center justify-center"
          >
            <Text className="text-light font-semibold">Visit Shop</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}