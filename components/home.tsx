import Link from 'next/link'

import { getSignInUrl, withAuth } from '@workos-inc/authkit-nextjs'
import { SignoutButton } from './signout-button'

export const Home = async () => {
  const { user } = await withAuth()
  const signInUrl = await getSignInUrl()

  return (
    <div className="flex flex-col h-[100vh] items-center justify-center">
      <h1 className="text-2xl font-bold mb-2">demo app</h1>
      {user ? (
        <div className="flex flex-col gap-2 justify-center items-center">
          <h2>Welcome back, {user.firstName}!</h2>
          <div className="flex gap-4">
            <Link
              href="/account"
              className="rounded-lg bg-foreground text-background py-2 px-4 hover:cursor-pointer"
            >
              My Account
            </Link>
            <SignoutButton />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 justify-center items-center">
          <h2>Not signed in</h2>
          <Link href={signInUrl} className="hover:underline">
            Sign in
          </Link>
        </div>
      )}
    </div>
  )
  // const { data: session } = useSession()
  // if (session) {
  //   return (
  //     <>
  //       Signed in as {session.user?.email} <br />
  //       <button
  //         className="hover:cursor-pointer hover:underline"
  //         onClick={() => signOut()}
  //       >
  //         Sign out
  //       </button>
  //     </>
  //   )
  // }
  // return (
  //   <>
  //     Not signed in <br />
  //     <button
  //       className="hover:cursor-pointer hover:underline"
  //       onClick={() =>
  //         signIn('workos', undefined, {
  //           organization: 'org_01JQ27W4BCRZCEYD46N2ZFVZ4Q',
  //         })
  //       }
  //     >
  //       Sign in
  //     </button>
  //   </>
  // )
}
