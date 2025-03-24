// import Stripe from 'stripe'

// export const POST = async (req: Request) => {
//   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
//   const body = await req.formData()
//   const lookupKey = body.get('lookup_key')
//   const sessionId = body.get('session_id')

//   const product = await stripe.products.retrieve(lookupKey as string)

//   const session = await stripe.checkout.sessions.create({
//     billing_address_collection: 'auto',
//     line_items: [
//       {
//         price: product.default_price as string,
//         // For metered billing, do not pass quantity
//         quantity: 1,
//       },
//     ],
//     mode: 'subscription',
//     success_url: `${process.env.NEXT_PUBLIC_URL!}/account?success=true&session_id=${sessionId}`,
//     cancel_url: `${process.env.NEXT_PUBLIC_URL!}/account?canceled=true`,
//   })

//   return Response.redirect(session.url as string, 303)
// }

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  const { priceId } = await request.json()

  try {
    const session = await stripe.checkout.sessions.create({
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
