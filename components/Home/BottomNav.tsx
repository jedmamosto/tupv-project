import type React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Home, ShoppingCart, User } from 'react-native-feather';

export type TabType = 'home' | 'cart' | 'profile';

interface BottomNavProps {
    currentTab: TabType;
    onTabPress: (tab: TabType) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabPress }) => {
    return (
        <View className="flex-row items-center justify-around border-t border-gray-200 bg-white py-2">
            <TouchableOpacity
                onPress={() => onTabPress('home')}
                className="items-center"
            >
                <Home
                    stroke={currentTab === 'home' ? '#3d5300' : '#687076'}
                    width={24}
                    height={24}
                />
                <Text
                    className={`mt-1 text-xs ${currentTab === 'home' ? 'text-primary' : 'text-gray-500'}`}
                >
                    Home
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => onTabPress('cart')}
                className="items-center"
            >
                <ShoppingCart
                    stroke={currentTab === 'cart' ? '#3d5300' : '#687076'}
                    width={24}
                    height={24}
                />
                <Text
                    className={`mt-1 text-xs ${currentTab === 'cart' ? 'text-primary' : 'text-gray-500'}`}
                >
                    Cart
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => onTabPress('profile')}
                className="items-center"
            >
                <User
                    stroke={currentTab === 'profile' ? '#3d5300' : '#687076'}
                    width={24}
                    height={24}
                />
                <Text
                    className={`mt-1 text-xs ${currentTab === 'profile' ? 'text-primary' : 'text-gray-500'}`}
                >
                    Profile
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default BottomNav;
