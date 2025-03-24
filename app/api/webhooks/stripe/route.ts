import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')
  let event

  try {
    event = stripe.webhooks.constructEvent(body, sig!, endpointSecret!)
  } catch (err) {
    const { message } = err as Error
    console.error('Error verifying webhook signature:', err)
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 },
    )
  }

  // Handle the event
  switch (event.type) {
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object)
      break
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object)
      break
    case 'invoice.payment_succeeded':
      await handleInvoicePaid(event.data.object)
      break
    // ... handle other events
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}

async function handleSubscriptionUpdated(subscription: { id: string }) {
  // Update the subscription status in your database
  // You might want to update the user's access level based on the new subscription status
  console.log('Subscription updated:', subscription.id)
}

async function handleSubscriptionDeleted(subscription: { id: string }) {
  // Update the subscription status in your database
  // You might want to revoke the user's access to premium features
  console.log('Subscription deleted:', subscription.id)
}

async function handleInvoicePaid(invoice: { id: string }) {
  // Update the user's payment status in your database
  // You might want to extend the user's access period
  console.log('Invoice paid:', invoice.id)
}

export const config = {
  api: {
    bodyParser: false,
  },
}
