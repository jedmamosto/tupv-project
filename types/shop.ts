export interface MenuItem {
    id?: string;
    userId: string;
    name: string;
    price: number;
    image: any;
    isAvailable: boolean;
    description?: string;
    category?: string;
    quantity?: number;
    options?: {
        name: string;
        choices: {
            id: string;
            name: string;
            price?: number;
        }[];
    }[];
}

export interface ProductCategory {
    id: string;
    name: string;
}

export interface Shop {
    id: string;
    name: string;
    coverImage: any;
    description?: string;
    categories?: ProductCategory[];
    featuredItems: MenuItem[];
    menuItems: MenuItem[];
}

export interface CartItem extends MenuItem {
    quantity: number;
}

export interface Order {
    id: string;
    shopId: string;
    items: CartItem[];
    total: number;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    paymentMethod: 'counter' | 'online';
    createdAt: Date;
    updatedAt: Date;
}

export interface User {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    orders?: Order[];
}

export interface PaymentMethod {
    id: string;
    name: string;
    type: 'counter' | 'online';
}
