import { Timestamp } from 'firebase/firestore';
import { UserRole } from './enums';

export interface User {
    id: string;
    idNumber: string;
    name: string;
    email: string;
    role: UserRole;
    paymongoSecretKey: string;
    createdAt: Timestamp;
}
