import Image from 'next/image'
import { withAuth, signOut } from '@workos-inc/authkit-nextjs'

export default async function AccountPage() {
  const { user } = await withAuth()

  return (
    <div className="container mx-auto p-8">
      <h1 className="font-extrabold text-3xl tracking-tight mb-8 uppercase">
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
      <div className="flex gap-2 my-8">
        <form
          action={async () => {
            'use server'
            await signOut()
          }}
        >
          <button className="rounded-lg bg-red-600 text-white py-2 px-4 hover:cursor-pointer">
            Sign out
          </button>
        </form>
        <form action="/api/checkout" method="POST">
          {/* Add a hidden field with the lookup_key of your Price */}
          <input type="hidden" name="lookup_key" value="prod_S0F9oqtTwLloBt" />
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
