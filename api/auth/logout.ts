import type { VercelRequest, VercelResponse } from '@vercel/node'
import { withSecurity, ok, fail } from '../_lib/utils'

export default withSecurity(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    fail(res, 'Method not allowed', 405)
    return
  }
  // Stateless JWT — client is responsible for discarding the token.
  ok(res, { message: 'Logged out. Please remove the token from your session.' })
})
