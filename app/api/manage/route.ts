import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  const { customerId }: { customerId: string } = await request.json()

  try {
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
