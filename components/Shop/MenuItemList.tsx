import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Minus, Plus, Info } from "react-native-feather";
import { MenuItem as MenuItemType } from "../../types/shop";
import ProductOptions from "./ProductOptions";

interface MenuItemProps {
  item: MenuItemType;
  onAddToCart: (item: MenuItemType, options: Record<string, string>) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export default function MenuItemList({
  item,
  onAddToCart,
  onUpdateQuantity,
}: MenuItemProps) {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [isExpanded, setIsExpanded] = useState(false);

  function handleOptionSelect(optionName: string, choiceId: string) {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: choiceId,
    }));
  }

  function calculateTotalPrice() {
    let total = item.price;
    if (item.options) {
      item.options.forEach((option) => {
        const selectedChoice = option.choices.find(
          (choice) => choice.id === selectedOptions[option.name]
        );
        if (selectedChoice?.price) {
          total += selectedChoice.price;
        }
      });
    }
    return total;
  }

  return (
    <View className="p-4 border-b border-secondary-50">
      <View className="flex-row">
        <Image
          source={
            typeof item.image === "string" ? { uri: item.image } : item.image
          }
          className="w-16 h-16 rounded-full"
        />
        <View className="flex-1 ml-4">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-lg font-semibold text-primary">
                {item.name}
              </Text>
              <Text className="text-secondary-900 text-sm">
                {item.description}
              </Text>
              <Text className="text-primary font-medium mt-1">
                ₱{calculateTotalPrice().toFixed(2)}
              </Text>
            </View>
            {item.options && (
              <TouchableOpacity
                onPress={() => setIsExpanded(!isExpanded)}
                className="p-2"
              >
                <Info
                  stroke={isExpanded ? "#3d5300" : "#8b9866"}
                  width={20}
                  height={20}
                />
              </TouchableOpacity>
            )}
          </View>

          {isExpanded && (
            <ProductOptions
              item={item}
              selectedOptions={selectedOptions}
              onOptionSelect={handleOptionSelect}
            />
          )}

          <View className="flex-row items-center justify-between mt-3">
            <View className="flex-row items-center space-x-2">
              <TouchableOpacity
                onPress={() =>
                  onUpdateQuantity(item.id, (item.quantity || 0) - 1)
                }
                className="p-1"
                disabled={!item.quantity}
              >
                <Minus
                  stroke={item.quantity ? "#3d5300" : "#8b9866"}
                  width={20}
                  height={20}
                />
              </TouchableOpacity>
              <Text className="w-8 text-center text-primary">
                {item.quantity || 0}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  onUpdateQuantity(item.id, (item.quantity || 0) + 1)
                }
                className="p-1"
              >
                <Plus stroke="#3d5300" width={20} height={20} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => onAddToCart(item, selectedOptions)}
              className="bg-accent-yellow px-4 py-2 rounded-lg"
              disabled={!item.available}
            >
              <Text className="text-primary font-medium">
                {item.available ? "Add to Cart" : "Unavailable"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
