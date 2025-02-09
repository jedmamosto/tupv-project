import { Timestamp } from 'firebase/firestore';
import { PaymentMethod, PaymentStatus } from './enums';

export interface PaymentInformation {
    id: string;
    orderId: string;
    userId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    status: PaymentStatus;
    referenceNumber?: string;
    paymongoPaymentId?: string;
    paymongoPaymentIntent?: string;
    metadata?: Record<string, any>;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}
