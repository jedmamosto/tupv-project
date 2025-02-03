import { View, TouchableOpacity, Text } from "react-native";
import { Home, ShoppingCart, User } from "react-native-feather";
import Animated, { useAnimatedStyle, withTiming, interpolateColor } from "react-native-reanimated";
import type { ElementType } from "react";

export type TabType = "home" | "cart" | "profile";

interface BottomNavProps {
  currentTab: TabType;
  onTabPress: (tab: TabType) => void;
}

function BottomNav({ currentTab, onTabPress }: BottomNavProps) {
  const tabs: TabType[] = ["home", "cart", "profile"];

  return (
    <View className="flex-row justify-around items-center border-t border-gray-300 bg-white py-2 px-5">
      {tabs.map((tab) => (
        <TabButton key={tab} tab={tab} currentTab={currentTab} onPress={() => onTabPress(tab)} />
      ))}
    </View>
  );
}

interface TabButtonProps {
  tab: TabType;
  currentTab: TabType;
  onPress: () => void;
}

function TabButton({ tab, currentTab, onPress }: TabButtonProps) {
  const isActive = tab === currentTab;

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(isActive ? 1 : 0, [0, 1], ["transparent", "rgba(61, 83, 0, 0.1)"]);
    return { backgroundColor: withTiming(backgroundColor, { duration: 300 }) };
  });

  function getIcon(): ElementType {
    switch (tab) {
      case "home": return Home;
      case "cart": return ShoppingCart;
      case "profile": return User;
      default: return Home;
    }
  }

  const Icon = getIcon();

  return (
    <Animated.View className="rounded-lg" style={animatedStyle}>
      <TouchableOpacity onPress={onPress} className="flex items-center justify-center py-2 px-4">
        <Icon stroke={isActive ? "#3d5300" : "#687076"} width={24} height={24} />
        <Text className={`mt-1 text-xs font-medium ${isActive ? "text-green-800" : "text-gray-500"}`}>
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default BottomNav;
