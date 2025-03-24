import Stripe from 'stripe'

export const POST = async (req: Request) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const body = await req.formData()
  const lookupKey = body.get('lookup_key')
  const sessionId = body.get('session_id')

  const product = await stripe.products.retrieve(lookupKey as string)

  const session = await stripe.checkout.sessions.create({
    billing_address_collection: 'auto',
    line_items: [
      {
        price: product.default_price as string,
        // For metered billing, do not pass quantity
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_URL!}/account?success=true&session_id=${sessionId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL!}/account?canceled=true`,
  })

  return Response.redirect(session.url as string, 303)
}
