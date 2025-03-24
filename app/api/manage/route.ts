import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import type { User } from '@workos-inc/node'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  const { user }: { user: User } = await request.json()
  console.log('user', user)

  try {
    // Get the customer ID from your database based on the authenticated user
    const customerId = 'cus_example123' // Replace with actual customer ID retrieval logic

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${request.headers.get('origin')}/account`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error creating portal session' },
      { status: 500 },
    )
  }
}
