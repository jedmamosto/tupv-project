import { View, TouchableOpacity, Text } from 'react-native';
import { Home, ShoppingCart, User } from 'react-native-feather';
import Animated, {
    useAnimatedStyle,
    withSpring,
    ZoomIn,
} from 'react-native-reanimated';

export type TabType = 'home' | 'cart' | 'profile';

interface BottomNavProps {
    currentTab: TabType;
    onTabPress: (tab: TabType) => void;
    cartItemCount: number;
}

const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);

function BottomNav({ currentTab, onTabPress, cartItemCount }: BottomNavProps) {
    const tabs: TabType[] = ['home', 'cart', 'profile'];

    return (
        <View className="flex-row items-center justify-around border-t border-gray-200 bg-white px-4 py-2">
            {tabs.map((tab) => (
                <TabButton
                    key={tab}
                    tab={tab}
                    currentTab={currentTab}
                    onPress={() => onTabPress(tab)}
                    cartItemCount={tab === 'cart' ? cartItemCount : 0}
                />
            ))}
        </View>
    );
}

interface TabButtonProps {
    tab: TabType;
    currentTab: TabType;
    onPress: () => void;
    cartItemCount: number;
}

function TabButton({
    tab,
    currentTab,
    onPress,
    cartItemCount,
}: TabButtonProps) {
    const isActive = tab === currentTab;

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            {
                scale: withSpring(isActive ? 1.1 : 1, {
                    damping: 15,
                    stiffness: 150,
                }),
            },
        ],
    }));

    const color = isActive ? '#3d5300' : '#687076';

    const renderIcon = () => {
        switch (tab) {
            case 'home':
                return <Home stroke={color} width={24} height={24} />;
            case 'cart':
                return <ShoppingCart stroke={color} width={24} height={24} />;
            case 'profile':
                return <User stroke={color} width={24} height={24} />;
        }
    };

    return (
        <AnimatedTouchableOpacity
            onPress={onPress}
            style={animatedStyle}
            className={`relative items-center justify-center rounded-full px-4 py-2 ${
                isActive ? 'bg-primary/10' : ''
            }`}
        >
            {renderIcon()}
            <Text
                className={`mt-1 text-xs font-medium ${
                    isActive ? 'text-primary' : 'text-gray-500'
                }`}
            >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
            {tab === 'cart' && cartItemCount > 0 && (
                <Animated.View
                    className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full bg-red-500"
                    entering={ZoomIn}
                >
                    <Text className="text-xs font-bold text-white">
                        {cartItemCount}
                    </Text>
                </Animated.View>
            )}
        </AnimatedTouchableOpacity>
    );
}

export default BottomNav;
