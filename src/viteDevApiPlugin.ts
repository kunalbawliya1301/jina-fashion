import 'dotenv/config'
import type { Plugin, ViteDevServer } from 'vite'

/**
 * Dev API Router Plugin: dynamically executes Vercel serverless handlers on-demand during local dev
 */
export function viteDevApiPlugin(): Plugin {
  return {
    name: 'dev-api-router',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req: any, res: any, next: () => void) => {
        const urlStr = req.url || ''
        if (!urlStr.startsWith('/api')) {
          return next()
        }

        try {
          const fullUrl = new URL(urlStr, `http://${req.headers.host || 'localhost:8443'}`)
          const pathname = fullUrl.pathname

          let bodyData: any = {}
          if (['POST', 'PUT', 'PATCH'].includes(req.method || '')) {
            bodyData = await new Promise(resolve => {
              let body = ''
              req.on('data', (chunk: any) => { body += chunk.toString() })
              req.on('end', () => {
                try { resolve(body ? JSON.parse(body) : {}) } catch { resolve({}) }
              })
            })
          }

          const query: Record<string, string> = {}
          fullUrl.searchParams.forEach((val, key) => { query[key] = val })
          req.query = query
          req.body = bodyData

          if (!res.status) {
            res.status = (statusCode: number) => { res.statusCode = statusCode; return res }
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
              if (typeof data === 'object') return res.json(data)
              res.end(data)
              return res
            }
          }

          if (pathname === '/api/health') {
            const mod = await server.ssrLoadModule('./api/health.ts')
            return await mod.default(req, res)
          }
          if (pathname === '/api/auth/login') {
            const mod = await server.ssrLoadModule('./api/auth/login.ts')
            return await mod.default(req, res)
          }
          if (pathname === '/api/auth/logout') {
            const mod = await server.ssrLoadModule('./api/auth/logout.ts')
            return await mod.default(req, res)
          }
          if (pathname === '/api/contact') {
            const mod = await server.ssrLoadModule('./api/contact.ts')
            return await mod.default(req, res)
          }
          if (pathname === '/api/products') {
            const mod = await server.ssrLoadModule('./api/products/index.ts')
            return await mod.default(req, res)
          }

          const toggleMatch = pathname.match(/^\/api\/products\/([^/]+)\/toggle-featured$/)
          if (toggleMatch) {
            req.query.id = toggleMatch[1]
            const mod = await server.ssrLoadModule('./api/products/[id]/toggle-featured.ts')
            return await mod.default(req, res)
          }

          const productMatch = pathname.match(/^\/api\/products\/([^/]+)$/)
          if (productMatch) {
            req.query.id = productMatch[1]
            const mod = await server.ssrLoadModule('./api/products/[id].ts')
            return await mod.default(req, res)
          }

          if (pathname === '/api/upload/signature') {
            const mod = await server.ssrLoadModule('./api/upload/signature.ts')
            return await mod.default(req, res)
          }

          res.status(404).json({ success: false, message: `Route not found: ${req.method} ${pathname}` })
        } catch (err: any) {
          console.error('[vite-dev-api] Error:', err)
          if (!res.headersSent) {
            res.status(500).json({ success: false, message: err?.message || 'Local API Error' })
          }
        }
      })
    },
  }
}
