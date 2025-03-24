import type { User } from '@workos-inc/node'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

type payload = { priceId: string; user: User }

export async function POST(request: NextRequest) {
  const { priceId, user }: payload = await request.json()

  try {
    const session = await stripe.checkout.sessions.create({
      client_reference_id: user.id,
      customer_email: user.email,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/account?canceled=true`,
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 },
    )
  }
}
