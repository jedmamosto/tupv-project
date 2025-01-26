import type { Order } from '../types/vendor';

export const mockRecentOrder: Order = {
    id: '1',
    orderNumber: 'ORD-001',
    customerName: 'John Doe',
    status: 'received',
    total: 150.0,
    items: [
        {
            menuItem: {
                id: 'm1',
                name: 'Adobo',
                price: 50.0,
                image: require('../assets/images/placeholder-featured.jpg'),
                available: true,
            },
            quantity: 2,
        },
        {
            menuItem: {
                id: 'm4',
                name: 'Rice',
                price: 25.0,
                image: require('../assets/images/placeholder-featured.jpg'),
                available: true,
            },
            quantity: 2,
        },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
};
