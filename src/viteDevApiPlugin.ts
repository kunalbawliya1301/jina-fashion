import 'dotenv/config'
import type { IncomingMessage } from 'node:http'
import type { Plugin } from 'vite'

import healthHandler from '../api/health'
import loginHandler from '../api/auth/login'
import logoutHandler from '../api/auth/logout'
import productsIndexHandler from '../api/products/index'
import productIdHandler from '../api/products/[id]'
import productToggleFeaturedHandler from '../api/products/[id]/toggle-featured'
import uploadSignatureHandler from '../api/upload/signature'

/**
 * Decorates Node standard req/res to match VercelRequest & VercelResponse interfaces
 */
function prepareVercelReqRes(req: any, res: any, bodyData: any, urlObj: URL) {
  // Query params
  const query: Record<string, string> = {}
  urlObj.searchParams.forEach((val, key) => {
    query[key] = val
  })
  req.query = query
  req.body = bodyData

  // Res helpers
  if (!res.status) {
    res.status = (statusCode: number) => {
      res.statusCode = statusCode
      return res
    }
  }
  if (!res.json) {
    res.json = (data: any) => {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(data))
      return res
    }
  }
  if (!res.send) {
    res.send = (data: any) => {
      if (typeof data === 'object') {
        return res.json(data)
      }
      res.end(data)
      return res
    }
  }
}

/**
 * Parses JSON body from incoming HTTP request
 */
function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise(resolve => {
    let body = ''
    req.on('data', (chunk: Buffer | string) => {
      body += chunk.toString()
    })
    req.on('end', () => {
      if (!body) return resolve({})
      try {
        resolve(JSON.parse(body))
      } catch {
        resolve({})
      }
    })
  })
}

/**
 * Vite Plugin: Dev API Router for Vercel Serverless Functions
 */
export function viteDevApiPlugin(): Plugin {
  return {
    name: 'vite-plugin-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req: any, res: any, next: () => void) => {
        const urlStr = req.url || ''
        if (!urlStr.startsWith('/api')) {
          return next()
        }

        try {
          const fullUrl = new URL(urlStr, `http://${req.headers.host || 'localhost:8443'}`)
          const pathname = fullUrl.pathname
          const bodyData = req.method !== 'GET' && req.method !== 'HEAD' ? await parseBody(req) : {}

          prepareVercelReqRes(req, res, bodyData, fullUrl)

          // ── Route matching ────────────────────────────────────────────────
          if (pathname === '/api/health') {
            return await healthHandler(req, res)
          }

          if (pathname === '/api/auth/login') {
            return await loginHandler(req, res)
          }

          if (pathname === '/api/auth/logout') {
            return await logoutHandler(req, res)
          }

          if (pathname === '/api/products') {
            return await productsIndexHandler(req, res)
          }

          // /api/products/:id/toggle-featured
          const toggleMatch = pathname.match(/^\/api\/products\/([^/]+)\/toggle-featured$/)
          if (toggleMatch) {
            req.query.id = toggleMatch[1]
            return await productToggleFeaturedHandler(req, res)
          }

          // /api/products/:id
          const productMatch = pathname.match(/^\/api\/products\/([^/]+)$/)
          if (productMatch) {
            req.query.id = productMatch[1]
            return await productIdHandler(req, res)
          }

          if (pathname === '/api/upload/signature') {
            return await uploadSignatureHandler(req, res)
          }

          // Unmatched /api route
          res.status(404).json({ success: false, message: `Route not found: ${req.method} ${pathname}` })
        } catch (err: any) {
          console.error('[vite-dev-api] Error handling request:', err)
          if (!res.headersSent) {
            res.status(500).json({ success: false, message: err?.message || 'Local API Error' })
          }
        }
      })
    },
  }
}
