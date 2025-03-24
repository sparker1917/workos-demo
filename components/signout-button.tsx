import { signOut } from '@workos-inc/authkit-nextjs'

export const SignoutButton = async () => {
  return (
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
  )
}
