'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import type { User } from '@workos-inc/node'
import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
)

type Plan = {
  id: string
  name: string
  description: string
  price: number
  interval: string
  price_id: string
}

type Customer = {
  id: string
  email: string
}

export const Account = ({ user }: { user: User }) => {
  {
    const [customer, setCustomer] = useState<Customer>()
    const [plans, setPlans] = useState<Plan[]>([])
    const searchParams = useSearchParams()
    const canceled = searchParams.get('canceled')
    const [isLoading, setIsLoading] = useState(false)

    const handleManageSubscription = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/manage', {
          method: 'POST',
          body: JSON.stringify({ customerId: customer?.id }),
        })
        const { url } = await response.json()
        window.location.href = url
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    useEffect(() => {
      // Fetch subscription plans from your API
      fetch('/api/plans')
        .then((res) => res.json())
        .then((data) => setPlans(data))

      fetch('/api/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }),
      })
        .then((res) => res.json())
        .then(({ customer }) => {
          if (customer.data.length > 0) {
            setCustomer(customer.data[0])
          }
        })
    }, [])

    const handleSubscribe = async (priceId: string) => {
      const stripe = await stripePromise
      const { sessionId } = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId, user }),
      }).then((res) => res.json())

      const result = await stripe?.redirectToCheckout({ sessionId })

      if (result?.error) {
        console.error(result.error)
      }
    }

    return (
      <div className="container mx-auto p-8">
        <Link href="/">&laquo; Go Back</Link>
        <h1 className="font-extrabold text-3xl tracking-tight my-8 uppercase">
          My Account
        </h1>
        <div className="flex gap-2 w-full">
          <div>
            <Image
              src={user?.profilePictureUrl!}
              alt="Profile picture"
              width={50}
              height={50}
              className="rounded-full"
            />
          </div>
          <div>
            <p className="font-bold text-xl">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-stone-500">{user?.email}</p>
            {customer && (
              <p className="text-stone-500">Stripe ID: {customer?.id}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 my-8">
          <h2 className="font-bold text-2xl mb-4">
            Choose a Subscription Plan
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div key={plan.id}>
                <h3 className="font-bold text-xl mb-2">{plan.name}</h3>
                <p className="text-sm">{plan.description}</p>
                <p>
                  Price:{' '}
                  <strong>
                    ${plan.price / 100} / {plan.interval}
                  </strong>
                </p>
                <button
                  className="rounded-lg bg-foreground text-background py-2 px-4 hover:cursor-pointer mt-8"
                  onClick={() => handleSubscribe(plan.price_id)}
                >
                  Subscribe
                </button>
              </div>
            ))}
          </div>
          {customer?.id && (
            <div className="mt-8">
              <button
                onClick={handleManageSubscription}
                disabled={isLoading}
                className="rounded-lg bg-red-600 text-white py-2 px-4 hover:cursor-pointer"
              >
                {isLoading ? 'Loading...' : 'Manage Subscription'}
              </button>
            </div>
          )}
          {canceled && <p className="text-red-500">Payment canceled.</p>}
        </div>
      </div>
    )
  }
}
