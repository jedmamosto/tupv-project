import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Concessionaire } from "../../data/mockConcessionaires";

interface ConcessionaireItemProps {
  concessionaire: Concessionaire;
  onPress: (id: string) => void;
}

export const ConcessionaireItem: React.FC<ConcessionaireItemProps> = ({
  concessionaire,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(concessionaire.id)}
      className="items-center mb-6 w-full"
    >
      <View className="w-4/5 h-32 bg-gray-400 rounded-lg mb-2" />
      <Text className="text-gray-700 font-bold text-center">
        {concessionaire.name}
      </Text>
    </TouchableOpacity>
  );
};
