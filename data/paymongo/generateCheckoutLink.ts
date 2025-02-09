import { db } from '@/lib/firebase/config';
import { queryDocumentById } from '@/lib/firebase/firestore';
import { Cart, CartItem } from '@/types/cart';
import { Collections } from '@/types/collections';
import { Order, OrderItem } from '@/types/order';
import { User } from '@/types/user';
import { collection, getDocs, Timestamp } from 'firebase/firestore';

interface PaymongoCheckoutResponse {
    success: boolean;
    error?: string;
    checkoutUrl?: string;
}

export default async function generateCheckoutLink(
    vendorId: string,
    customerId: string,
    cartId: string
): Promise<PaymongoCheckoutResponse> {
    try {
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

        const fetchCustomerUser = await queryDocumentById<User>(
            Collections.Users,
            customerId
        );

        console.log('Fetch customer done');

        const customerUserData: User = fetchCustomerUser.data as User;

        const fetchCartData = await queryDocumentById<Cart>(
            Collections.Carts,
            cartId
        );

        const cartData: Cart = fetchCartData.data as Cart;

        const sampleCart: Cart = {
            id: 'cart123',
            userId: 'user456',
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        };

        // Sample items subcollection data (as it would appear in Firebase)
        const sampleCartItems = [
            {
                menuItemId: 'menu789',
                name: 'Sisig',
                price: 150,
                quantity: 2,
            },
            {
                menuItemId: 'menu101',
                name: 'Beef Sinigang',
                price: 200,
                quantity: 1,
            },
        ];

        // Sample line items (after transformation)
        const sampleLineItems = [
            {
                currency: 'PHP',
                amount: 15000, // 150 * 100
                description: 'No description provided',
                name: 'Sisig',
                quantity: 2,
            },
            {
                currency: 'PHP',
                amount: 20000, // 200 * 100
                description: 'No description provided',
                name: 'Beef Sinigang',
                quantity: 1,
            },
        ];

        // Then fetch the items subcollection
        const itemsCollectionRef = collection(
            db,
            Collections.Carts,
            cartId,
            'items'
        );
        const itemsSnapshot = await getDocs(itemsCollectionRef);

        console.log(
            'Items subcollection data:',
            itemsSnapshot.docs.map((doc) => doc.data())
        );

        const cartItems = itemsSnapshot.docs.map((doc) => ({
            menuItemId: doc.data().menuItemId || doc.id,
            name: doc.data().name,
            price: doc.data().price,
            quantity: doc.data().quantity,
        }));

        const lineItems = cartItems.map((cartItem: CartItem) => ({
            currency: 'PHP',
            amount: cartItem.price * 100,
            description: 'No description provided',
            name: cartItem.name,
            quantity: cartItem.quantity,
        }));

        const createCheckoutSession = await fetch(
            'https://api.paymongo.com/v1/checkout_sessions',
            {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json',
                    authorization: `Basic ${base64Encode(
                        vendorUserData?.paymongoSecretKey as string
                    )}`,
                },
                body: JSON.stringify({
                    data: {
                        attributes: {
                            billing: {
                                email: 'sampleEmail@email.com',
                                name: 'sample user',
                            },
                            send_email_receipt: false,
                            show_description: true,
                            show_line_items: true,
                            description: 'No description provided',
                            line_items: sampleLineItems,
                            payment_method_types: [
                                'qrph',
                                'billease',
                                'card',
                                'dob',
                                'dob_ubp',
                                'brankas_bdo',
                                'brankas_landbank',
                                'brankas_metrobank',
                                'gcash',
                                'grab_pay',
                                'paymaya',
                            ],
                            success_url: 'https://www.google.com/',
                            cancel_url: 'https://www.google.com/',
                        },
                    },
                }),
            }
        );

        const checkoutResponse = await createCheckoutSession.json();
        console.log('Checkout Session Response: ', checkoutResponse);
        const checkoutUrl = checkoutResponse.data.attributes.checkout_url;
        const checkoutSession = checkoutResponse.data.id;

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

        if (createCheckoutSession.ok) {
            console.log(checkoutUrl);
            return {
                success: true,
                checkoutUrl: checkoutUrl,
            };
        } else {
            return {
                success: false,
            };
        }
    } catch (error) {
        console.error(
            'Error encountered at generating Paymongo checkout link',
            error
        );
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Unknown error encountered at generating Paymongo checkout link',
        };
    }
}
