import React, { useState, useEffect } from "react";
import { View, ScrollView, ActivityIndicator, Text } from "react-native";
import { Header } from "../../components/Home/Header";
import { ConcessionaireItem } from "../../components/Home/ConcessionaireItem";
import {
  Concessionaire,
  mockConcessionaires,
} from "../../data/mockConcessionaires";

export default function Home() {
  const [concessionaires, setConcessionaires] = useState<Concessionaire[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConcessionaires = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setConcessionaires(mockConcessionaires);
      setLoading(false);
    };

    fetchConcessionaires();
  }, []);

  const handleMenuPress = () => {
    console.log("Menu pressed");
  };

  const handleConcessionairePress = (id: string) => {
    console.log(`Concessionaire ${id} pressed`);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white">
        <Header onMenuPress={handleMenuPress} />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#4B5563" />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white mt-14">
      <Header onMenuPress={handleMenuPress} />
      <ScrollView className="flex-1">
        <View className="p-4">
          <Text className="text-8xl font-bold mb-4 text-gray-800">
            Application Home Screen
          </Text>
          {concessionaires.map((concessionaire) => (
            <ConcessionaireItem
              key={concessionaire.id}
              concessionaire={concessionaire}
              onPress={handleConcessionairePress}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
