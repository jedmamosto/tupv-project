import { Timestamp } from 'firebase/firestore';
import { OrderStatus, PaymentMethod } from './enums';

export interface OrderItem {
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
}

export interface Order {
    id: string;
    userId: string;
    shopId: string;
    customerName: string;
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    paymentId?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}
