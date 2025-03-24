import { withAuth } from '@workos-inc/authkit-nextjs'
import { Account } from '@/components/account'

export default async function AccountPage() {
  const { user } = await withAuth()

  return <Account user={user!} />
}
