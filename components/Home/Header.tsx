import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Menu } from "react-native-feather";

interface HeaderProps {
  onMenuPress: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuPress }) => {
  return (
    <View className="w-full bg-gray-500 p-4">
      <TouchableOpacity onPress={onMenuPress} className="w-6 h-6">
        <Menu stroke="white" width={24} height={24} />
      </TouchableOpacity>
    </View>
  );
};
