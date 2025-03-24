import { withAuth } from '@workos-inc/authkit-nextjs'
import { Account } from '@/components/account'

export default async function AccountPage() {
  const { user, sessionId } = await withAuth()

  return <Account sessionId={sessionId!} user={user!} />
}
