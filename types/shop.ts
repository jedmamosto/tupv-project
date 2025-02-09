export interface MenuItem {
    id?: string;
    vendorId: string;
    name: string;
    price: number;
    image: any;
    isAvailable: boolean;
    description?: string;
    stockCount: number;
}

export interface Shop {
    id: string;
    vendorId: string;
    name: string;
    coverImage: any;
    description?: string;
    category: string;
    qrCode?: string;
    menuItems: string[];
}
