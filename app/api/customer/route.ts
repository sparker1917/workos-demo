// import type { User } from '@workos-inc/node'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  const { email } = await request.json()

  try {
    const customer = await stripe.customers.search({
      query: `email:'${email}'`,
      limit: 1,
    })

    return NextResponse.json({ customer })
  } catch (error) {
    const { message } = error as Error
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
