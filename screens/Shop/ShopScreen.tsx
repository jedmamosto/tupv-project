import { useState, useEffect } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    StatusBar,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { ShoppingCart, ArrowLeft } from 'react-native-feather';
import { Image } from 'expo-image';
import Animated, {
    FadeInDown,
    FadeInRight,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    interpolate,
    useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import type { Shop, MenuItem } from '@/types/shop';
import { mockShops } from '@/data/mockData';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '@/contexts/CartContext';
import { queryAllDocuments } from '@/lib/firebase/firestore';
import { Collections } from '@/types/collections';

function ShopScreen() {
    const [shop, setShop] = useState<Shop | null>(null);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { shopId } = useLocalSearchParams<{ shopId: string }>();
    const insets = useSafeAreaInsets();
    const { cartItems, addToCart } = useCart();

    const scrollY = useSharedValue(0);
    const cartBadgeScale = useSharedValue(1);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    const headerStyle = useAnimatedStyle(() => ({
        opacity: interpolate(scrollY.value, [0, 100], [1, 1], 'clamp'),
    }));

    const imageStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: interpolate(scrollY.value, [-100, 0], [1.2, 1], 'clamp') },
        ],
    }));

    const cartBadgeStyle = useAnimatedStyle(() => ({
        transform: [{ scale: cartBadgeScale.value }],
    }));

    useEffect(() => {
        async function fetchShop() {
            // In a real app, you would fetch these from Firebase
            // This is just for mock data
            setTimeout(async () => {
                const shopQuery = await queryAllDocuments(Collections.Shops);
                const shops = shopQuery.data as Shop[];
                const foundShop = shops.find((s) => s.id === shopId);

                console.log(foundShop);
                if (foundShop) {
                    const menuItemsQuery = await queryAllDocuments(
                        Collections.MenuItems
                    );
                    const menuItems = menuItemsQuery.data as MenuItem[];
                    const filteredItems = menuItems.filter((item) =>
                        foundShop.menuItems.includes(item.id as string)
                    );
                    setShop(foundShop);
                    // Mock fetching menu items using the IDs
                    // In real app, you would fetch these from Firebase
                    setMenuItems(filteredItems);
                }
                setLoading(false);
            }, 1000);
        }
        fetchShop();
    }, [shopId]);

    function handleAddToCart(item: MenuItem) {
        if (!item.isAvailable || item.stockCount === 0) return;

        addToCart(item);
        cartBadgeScale.value = withSpring(1.2, {}, () => {
            cartBadgeScale.value = withSpring(1);
        });
    }

    function handleGoToCart() {
        if (cartItems.length > 0) {
            router.push({
                pathname: '/(customer)/cart',
                params: { shopId },
            });
        }
    }

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-100">
                <StatusBar barStyle="light-content" backgroundColor="#3d5300" />
                <ActivityIndicator size="large" color="#3d5300" />
                <Animated.Text
                    entering={FadeInDown}
                    className="mt-4 text-green-800"
                >
                    Loading menu...
                </Animated.Text>
            </View>
        );
    }

    if (!shop) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-100">
                <StatusBar barStyle="light-content" backgroundColor="#3d5300" />
                <Animated.Text entering={FadeInDown} className="text-red-500">
                    Shop not found
                </Animated.Text>
            </View>
        );
    }

    return (
        <SafeAreaView
            className="flex-1 bg-gray-100"
            style={{ paddingTop: insets.top }}
        >
            <StatusBar barStyle="light-content" backgroundColor="#3d5300" />
            <Animated.View
                style={[headerStyle, { zIndex: 100 }]}
                className="absolute left-0 right-0"
            >
                <LinearGradient
                    colors={[
                        'rgba(61, 83, 0, 0.9)',
                        'rgba(61, 83, 0, 0.7)',
                        'transparent',
                    ]}
                    className="flex-row items-center justify-between px-4 py-3"
                    style={{ marginTop: insets.top }}
                >
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="rounded-full bg-black/20 p-2"
                    >
                        <ArrowLeft stroke="#fff" width={24} height={24} />
                    </TouchableOpacity>
                    <Text
                        numberOfLines={1}
                        className="ml-4 flex-1 text-base font-bold text-white"
                    >
                        {shop.name}
                    </Text>
                    <TouchableOpacity
                        onPress={handleGoToCart}
                        className="relative rounded-full bg-black/20 p-2"
                    >
                        <ShoppingCart stroke="#fff" width={24} height={24} />
                        {cartItems.length > 0 && (
                            <Animated.View
                                style={cartBadgeStyle}
                                className="absolute -right-2 -top-2 h-5 w-5 items-center justify-center rounded-full bg-red-500"
                            >
                                <Text className="text-xs font-bold text-white">
                                    {cartItems.length}
                                </Text>
                            </Animated.View>
                        )}
                    </TouchableOpacity>
                </LinearGradient>
            </Animated.View>

            <Animated.ScrollView
                className="flex-1"
                onScroll={scrollHandler}
                scrollEventThrottle={16}
            >
                <Animated.View style={imageStyle}>
                    <Image
                        source={shop.coverImage}
                        style={{ width: '100%', height: 200 }}
                        contentFit="cover"
                    />
                </Animated.View>

                <View className="p-4">
                    {menuItems.map((item, index) => (
                        <Animated.View
                            key={item.id}
                            entering={FadeInDown.delay(index * 100).springify()}
                            className="mx-0 mb-4 flex-row overflow-hidden rounded-xl bg-white p-4 shadow-sm"
                        >
                            <Image
                                source={item.image}
                                style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 8,
                                }}
                                className="mr-4 rounded-lg"
                                contentFit="cover"
                            />
                            <View className="ml-2 flex-1">
                                <Text className="text-lg font-semibold text-green-800">
                                    {item.name}
                                </Text>
                                <Text className="text-gray-600">
                                    {item.description}
                                </Text>
                                <Text className="mt-2 font-bold text-green-800">
                                    ₱{item.price.toFixed(2)}
                                </Text>
                                {!item.isAvailable && (
                                    <Text className="text-red-500">
                                        Currently Unavailable
                                    </Text>
                                )}
                                {item.isAvailable && item.stockCount === 0 && (
                                    <Text className="text-red-500">
                                        Out of Stock
                                    </Text>
                                )}
                                {item.isAvailable &&
                                    item.stockCount > 0 &&
                                    item.stockCount <= 5 && (
                                        <Text className="text-orange-500">
                                            Only {item.stockCount} left
                                        </Text>
                                    )}
                            </View>
                            <TouchableOpacity
                                onPress={() => handleAddToCart(item)}
                                disabled={
                                    !item.isAvailable || item.stockCount === 0
                                }
                                className={`self-end rounded-lg px-3 py-2 ${
                                    !item.isAvailable || item.stockCount === 0
                                        ? 'bg-gray-400'
                                        : 'bg-green-800'
                                }`}
                            >
                                <Text className="font-semibold text-white">
                                    Add
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>
            </Animated.ScrollView>
        </SafeAreaView>
    );
}

export default ShopScreen;
