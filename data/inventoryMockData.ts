import type { VendorMenuItem } from '../types/vendor';

export const mockInventory: VendorMenuItem[] = [
    {
        id: 'm1',
        name: 'Adobo',
        price: 50.0,
        image: require('../assets/images/placeholder-featured.jpg'),
        available: true,
        stockCount: 20,
        isAvailable: true,
    },
    {
        id: 'm2',
        name: 'Ramen',
        price: 60.0,
        image: require('../assets/images/placeholder-featured.jpg'),
        available: true,
        stockCount: 15,
        isAvailable: true,
    },
];
