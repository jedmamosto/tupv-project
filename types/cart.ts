import { Timestamp } from 'firebase/firestore';

export interface CartItem {
    id?: string;
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
}

export interface Cart {
    id: string;
    userId: string;
    shopId: string;
    items: CartItem[];
    total: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}
