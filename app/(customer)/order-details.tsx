import { Button } from '@/components/custom/Button';
import { useAuth } from '@/contexts/AuthContext';
import generateCheckoutLink from '@/data/paymongo/generateCheckoutLink';
import { queryOneDocument } from '@/lib/firebase/firestore';
import { Collections } from '@/types/collections';
import { Order } from '@/types/order';
import { router, ExternalPathString } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text } from 'react-native';

export default function OrderDetails() {
    const { user } = useAuth();
    const [order, setOrder] = useState<Order>();

    const fetchOrderData = async () => {
        const orderResponse = await queryOneDocument<Order>(
            Collections.Orders,
            'userId',
            user?.id as string
        );

        if (!orderResponse.success && !orderResponse.data) {
            return null;
        }

        const orderData = orderResponse.data;

        setOrder(orderData);

        return orderData;
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchOrderData();
        };
        fetchData();
    }, []);

    const handlePayment = async () => {
        // Change this lou
        const testVendorId = 'p5DvsJ7HMhTdtRUyL1e76egpenG3';
        const testCustomerId = 'DjwwLEdfdbbN1CpjmhE4VNpqURH2';
        const testCartId = 'DTLAA0qE2Wns9pwNl10d';

        const checkoutLink = await generateCheckoutLink(
            testVendorId,
            testCustomerId,
            testCartId
        );

        if (checkoutLink.success && checkoutLink.checkoutUrl) {
            console.log('Checkout link:', checkoutLink.checkoutUrl);
            router.push({
                pathname: checkoutLink.checkoutUrl as ExternalPathString,
            });
        } else {
            router.push({
                pathname: '/(customer)/order-fail' as ExternalPathString,
            });
        }
    };

    const handleGenerateQR = () => {};

    return (
        <SafeAreaView className="flex-1">
            <View className="flex-1">
                <Text>Hello Order Details</Text>
                <Button label="Pay Online" onPress={handlePayment} />
                {/* Render Order Details Here*/}
                <Button label="Generate QR" onPress={handleGenerateQR} />
            </View>
        </SafeAreaView>
    );
}
