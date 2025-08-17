export enum orderStatus {
    PENDING = 'PENDING',          // Order placed, waiting for confirmation
    ACCEPTED = 'ACCEPTED',        // Seller/restaurant accepted the order
    PREPARING = 'PREPARING',      // Items being prepared
    READY_FOR_PICKUP = 'READY_FOR_PICKUP', // Packed and ready for rider
    PICKED_UP = 'PICKED_UP',      // Rider picked it up
    OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY', // On the way
    DELIVERED = 'DELIVERED',      // Successfully delivered
    CANCELLED = 'CANCELLED',      // Cancelled at any stage
    FAILED = 'FAILED',            // Payment/delivery failed (optional)
    RETURNED = 'RETURNED',        // Customer returned item (e-commerce case)
}
