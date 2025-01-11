import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Home, ShoppingCart, User } from "react-native-feather";

interface BottomNavProps {
  currentTab: "home" | "cart" | "profile";
  onTabPress: (tab: "home" | "cart" | "profile") => void;
}

export default function BottomNav({ currentTab, onTabPress }: BottomNavProps) {
  return (
    <View className="flex-row justify-around items-center bg-light py-4 border-t border-secondary-100">
      <TouchableOpacity
        onPress={() => onTabPress("home")}
        className="items-center"
      >
        <Home
          stroke={currentTab === "home" ? "#3d5300" : "#8b9866"}
          width={24}
          height={24}
        />
        <Text
          className={`text-xs mt-1 ${
            currentTab === "home" ? "text-primary" : "text-secondary-100"
          }`}
        >
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onTabPress("cart")}
        className="items-center"
      >
        <ShoppingCart
          stroke={currentTab === "cart" ? "#3d5300" : "#8b9866"}
          width={24}
          height={24}
        />
        <Text
          className={`text-xs mt-1 ${
            currentTab === "cart" ? "text-primary" : "text-secondary-100"
          }`}
        >
          Cart
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onTabPress("profile")}
        className="items-center"
      >
        <User
          stroke={currentTab === "profile" ? "#3d5300" : "#8b9866"}
          width={24}
          height={24}
        />
        <Text
          className={`text-xs mt-1 ${
            currentTab === "profile" ? "text-primary" : "text-secondary-100"
          }`}
        >
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}
