import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  const { sessionId } = await request.json()

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    console.log(session)

    if (session.payment_status === 'paid') {
      // Update your database to mark the user as subscribed
      // await updateUserSubscriptionStatus(session.client_reference_id, 'active');
    }

    return NextResponse.json({ session })
  } catch (error) {
    const { message } = error as Error
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
