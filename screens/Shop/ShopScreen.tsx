import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import MenuItemList from "../../components/Shop/MenuItemList";
import { Shop, MenuItem } from "../../types/shop";
import { mockShops } from "../../data/mockData";
import { ArrowLeft } from "react-native-feather";
import { ShopScreenProps } from "../../types/navigations";

function ShopScreen({ route, navigation }: ShopScreenProps) {
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const { shopId } = route.params;

  useEffect(() => {
    console.log("Fetching shop for shopId:", shopId);
    const foundShop = mockShops.find((s) => s.id === shopId);
    console.log("Found Shop:", foundShop);
    if (foundShop) {
      setShop(foundShop);
      setMenuItems(
        foundShop.menuItems.map((item) => ({ ...item, quantity: 0 }))
      );
    }
    setLoading(false);
  }, [shopId]);

  function handleUpdateQuantity(itemId: string, quantity: number) {
    if (quantity < 0) return;
    setMenuItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  }

  function handleAddToCart(item: MenuItem) {
    console.log("Adding to cart:", item);
  }

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f8f9fa",
        }}
      >
        <StatusBar barStyle="light-content" backgroundColor="#3d5300" />
        <ActivityIndicator size="large" color="#3d5300" />
        <Text style={{ marginTop: 16, color: "#3d5300" }}>Loading menu...</Text>
      </View>
    );
  }

  if (!shop) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f8f9fa",
        }}
      >
        <StatusBar barStyle="light-content" backgroundColor="#3d5300" />
        <Text style={{ color: "red" }}>Shop not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
      <StatusBar barStyle="light-content" backgroundColor="#3d5300" />
      <View
        style={{
          backgroundColor: "#3d5300",
          paddingTop: 48,
          paddingBottom: 16,
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginRight: 16 }}
        >
          <ArrowLeft stroke="#fff" width={24} height={24} />
        </TouchableOpacity>
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
          {shop.name}
        </Text>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {menuItems.map((item) => (
          <MenuItemList
            key={item.id}
            item={item}
            onUpdateQuantity={handleUpdateQuantity}
            onAddToCart={handleAddToCart}
          />
        ))}
      </ScrollView>
    </View>
  );
}

export default ShopScreen;
