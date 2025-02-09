import { Timestamp } from 'firebase/firestore';
import { MenuItem, Shop } from './shop';

export interface VendorMenuItem extends MenuItem {
    stockCount?: number;
    isAvailable: boolean;
}

export interface Order {
    id: string;
    items: {
        menuItemId: string;
    }[];
    orderQuantity: number;
    status: 'received' | 'ready' | 'complete' | 'cancelled';
    total: number;
    customerName: string;
    orderNumber: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface VendorShop extends Shop {
    qrCode?: string;
    orders: Order[];
    inventory: VendorMenuItem[];
}
