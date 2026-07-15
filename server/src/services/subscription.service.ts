//subscription.service.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function createCheckoutSession(
    userId: string,
    email: string,
    plan: 'monthly' | 'yearly'
) {
    const priceId =
        plan === 'yearly'
        ? process.env.STRIPE_YEARLY_PRICE_ID
        : process.env.STRIPE_MONTHLY_PRICE_ID;

    if (!priceId) {
        throw new Error('Stripe Price ID is missing.');
    }

    const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer_email: email,
        payment_method_types: ['card'],
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],

        metadata: {
            userId,
            plan,
        },

        success_url: 
          `${process.env.FRONTEND_URL}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${process.env.FRONTEND_URL}/subscribe`,
    });

    return session.url;

}