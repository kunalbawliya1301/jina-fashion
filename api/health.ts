import type { VercelRequest, VercelResponse } from '@vercel/node'
import { withSecurity, ok } from './_lib/utils'

export default withSecurity(
  async (_req: VercelRequest, res: VercelResponse) => {
    ok(res, {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'production',
    })
  },
  { skipRateLimit: true }
)
