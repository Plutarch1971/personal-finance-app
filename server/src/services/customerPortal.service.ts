//customerPortal.service.ts
import Stripe from 'stripe';
import { User } from '../models/user';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createCustomerPortalSession( userId: string){

const user = await User.findByPk(userId);

if (!user) {
    throw new Error("User not found");
}

if (!user.stripeCustomerId){
    throw new Error("Stripe customer not found.")
}

const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.FRONTEND_URL}/dashboard`,
});

return session.url;
}