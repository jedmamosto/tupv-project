export enum UserRole {
    Customer = 'customer',
    Vendor = 'vendor',
}

export enum OrderStatus {
    Pending = 'pending',
    Processing = 'processing',
    Completed = 'completed',
    Cancelled = 'cancelled',
}

export enum PaymentMethod {
    Counter = 'counter',
    Online = 'online',
}

export enum PaymentStatus {
    Pending = 'pending',
    Paid = 'paid',
    Failed = 'failed',
    Refunded = 'refunded',
}
