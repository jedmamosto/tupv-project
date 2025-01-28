import type { Order } from '../types/vendor';

export const mockOrders: Order[] = [
    {
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
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '2',
        orderNumber: 'ORD-002',
        customerName: 'Jane Smith',
        status: 'ready',
        total: 120.0,
        items: [
            {
                menuItem: {
                    id: 'm2',
                    name: 'Ramen',
                    price: 60.0,
                    image: require('../assets/images/placeholder-featured.jpg'),
                    available: true,
                },
                quantity: 2,
            },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];
