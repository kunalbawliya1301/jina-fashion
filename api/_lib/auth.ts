import jwt from 'jsonwebtoken'

export interface AdminPayload {
  role: string
  iat: number
}

const JWT_SECRET     = () => process.env.JWT_SECRET as string
const JWT_EXPIRES_IN = () => process.env.JWT_EXPIRES_IN || '1h'

export function signToken(): string {
  if (!JWT_SECRET()) throw new Error('[auth] JWT_SECRET is not set')
  return jwt.sign(
    { role: 'admin' },
    JWT_SECRET(),
    {
      expiresIn: JWT_EXPIRES_IN() as jwt.SignOptions['expiresIn'],
      issuer:   'jina-fashion-api',
      audience: 'jina-fashion-admin',
    }
  )
}

export function verifyToken(token: string): AdminPayload {
  if (!JWT_SECRET()) throw new Error('[auth] JWT_SECRET is not set')
  const decoded = jwt.verify(token, JWT_SECRET(), {
    issuer:   'jina-fashion-api',
    audience: 'jina-fashion-admin',
  })
  return decoded as AdminPayload
}

/**
 * Extracts and verifies the Bearer token from an Authorization header string.
 * Returns the decoded payload or throws a typed error.
 */
export function requireAdmin(authHeader: string | undefined): AdminPayload {
  if (!authHeader?.startsWith('Bearer ')) {
    const err = new Error('No authentication token provided') as Error & { statusCode: number }
    err.statusCode = 401
    throw err
  }

  const token = authHeader.split(' ')[1]
  try {
    const payload = verifyToken(token)
    if (payload.role !== 'admin') {
      const err = new Error('Admin privileges required') as Error & { statusCode: number }
      err.statusCode = 403
      throw err
    }
    return payload
  } catch (jwtErr) {
    const e = jwtErr as Error & { statusCode?: number }
    if (e.statusCode) throw e // already typed
    const err = new Error(
      e.name === 'TokenExpiredError' ? 'Session expired. Please sign in again.' : 'Invalid authentication token'
    ) as Error & { statusCode: number; code?: string }
    err.statusCode = 401
    if (e.name === 'TokenExpiredError') err.code = 'TOKEN_EXPIRED'
    throw err
  }
}
