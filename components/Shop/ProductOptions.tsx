import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MenuItem } from "../../types/shop";

interface ProductOptionsProps {
  item: MenuItem;
  selectedOptions: Record<string, string>;
  onOptionSelect: (optionName: string, choiceId: string) => void;
}

export default function ProductOptions({
  item,
  selectedOptions,
  onOptionSelect,
}: ProductOptionsProps) {
  if (!item.options?.length) return null;

  return (
    <View className="mt-2">
      {item.options.map((option) => (
        <View key={option.name} className="mb-2">
          <Text className="text-primary font-medium mb-1">{option.name}</Text>
          <View className="flex-row flex-wrap gap-2">
            {option.choices.map((choice) => (
              <TouchableOpacity
                key={choice.id}
                onPress={() => onOptionSelect(option.name, choice.id)}
                className={`px-3 py-1 rounded-full border ${
                  selectedOptions[option.name] === choice.id
                    ? "bg-primary border-primary"
                    : "border-secondary-200"
                }`}
              >
                <Text
                  className={`${
                    selectedOptions[option.name] === choice.id
                      ? "text-light"
                      : "text-primary"
                  }`}
                >
                  {choice.name}
                  {choice.price ? ` (+₱${choice.price.toFixed(2)})` : ""}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}
