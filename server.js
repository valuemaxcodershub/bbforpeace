// server.js - Standalone server for cPanel deployment
const path = require('path')

process.env.NODE_ENV = 'production'
process.chdir(__dirname)

const port = parseInt(process.env.PORT, 10) || 3000
const hostname = process.env.HOSTNAME || '0.0.0.0'

// Load Next.js start server from standalone build
const { startServer } = require('next/dist/server/lib/start-server')

const nextConfig = require('./.next/required-server-files.json').config

startServer({
  dir: __dirname,
  isDev: false,
  config: nextConfig,
  hostname,
  port,
  allowRetry: false,
}).then(() => {
  console.log(`> BB4Peace ready on http://${hostname}:${port}`)
  console.log(`> Admin panel: http://${hostname}:${port}/admin`)
}).catch((err) => {
  console.error(err)
  process.exit(1)
})
