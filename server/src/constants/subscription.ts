//subscription.ts

export const SUBSCRIPTION_STATUS = {
    TRIAL: 'trial',
    ACTIVE: 'active',
    EXPIRED: 'expired',
    CANCELLED: 'cancelled',
} as const;

export type SubscriptionStatus = 
    typeof SUBSCRIPTION_STATUS[keyof typeof SUBSCRIPTION_STATUS];
    