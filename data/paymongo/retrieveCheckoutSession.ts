import { queryDocumentById } from '@/lib/firebase/firestore';
import { Collections } from '@/types/collections';
import { Order } from '@/types/order';
import { User } from '@/types/user';

export default async function retreiveCheckoutSession(
    vendorId: string,
    orderId: string
) {
    const base64Encode = (str: string): string => {
        return btoa(str);
    };

    const fetchVendorUser = await queryDocumentById<User>(
        Collections.Users,
        vendorId
    );

    console.log('Fetch vendor done');

    const vendorUserData: User = fetchVendorUser.data as User;

    console.log('Paymongo Secret', vendorUserData.paymongoSecretKey);

    const fetchOrder = await queryDocumentById<Order>(
        Collections.Orders,
        orderId
    );

    const orderData: Order = fetchOrder.data as Order;

    const checkoutSession = orderData.paymentId;

    const retrievedCheckout = await fetch(
        `https://api.paymongo.com/v1/checkout_sessions/${checkoutSession}`,
        {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                authorization: `Basic ${base64Encode(
                    vendorUserData?.paymongoSecretKey as string
                )}`,
            },
        }
    );
}
