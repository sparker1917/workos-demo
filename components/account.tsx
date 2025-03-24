// 'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { User } from '@workos-inc/node'
import { SignoutButton } from './signout-button'

export const Account = ({
  sessionId,
  user,
}: {
  sessionId: string
  user: User
}) => {
  return (
    <div className="container mx-auto p-8">
      <Link href="/">&laquo; Go Back</Link>
      <h1 className="font-extrabold text-3xl tracking-tight my-8 uppercase">
        My Account
      </h1>
      <div className="flex gap-2">
        <Image
          src={user?.profilePictureUrl!}
          alt="Profile picture"
          width={50}
          height={50}
          className="rounded-full"
        />
        <div>
          <p className="font-bold text-xl">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-stone-500">{user?.email}</p>
        </div>
      </div>
      <div className="flex gap-4 my-8">
        <SignoutButton />
        <form action="/api/checkout" method="POST">
          {/* Add a hidden field with the lookup_key of your product */}
          <input type="hidden" name="lookup_key" value="prod_S0F9oqtTwLloBt" />
          <input type="hidden" name="session_id" value={sessionId} />
          <button
            type="submit"
            className="rounded-lg bg-foreground text-background py-2 px-4 hover:cursor-pointer"
          >
            Subscribe $5 / month
          </button>
        </form>
      </div>
    </div>
  )
}
