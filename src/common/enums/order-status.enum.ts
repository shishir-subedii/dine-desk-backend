export enum orderStatus {
    PENDING = 'pending',          // Order placed, waiting for confirmation
    ACCEPTED = 'accepted',        // Seller/restaurant accepted the order
    PREPARING = 'preparing',      // Items being prepared
    READY_FOR_PICKUP = 'ready_for_pickup', // Packed and ready for rider
    PICKED_UP = 'picked_up',      // Rider picked it up
    OUT_FOR_DELIVERY = 'out_for_delivery', // On the way
    DELIVERED = 'delivered',      // Successfully delivered
    CANCELLED = 'cancelled',      // Cancelled at any stage
    FAILED = 'failed',            // Payment/delivery failed (optional)
    RETURNED = 'returned',        // Customer returned item (e-commerce case)
}
