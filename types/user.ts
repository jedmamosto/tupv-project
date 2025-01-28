import { Timestamp } from 'firebase/firestore';

export interface User {
    id: string;
    idNumber: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt?: Timestamp;
}

export enum UserRole {
    Customer = 'customer',
    Vendor = 'vendor',
}
