/**
 * Push Schema to Supabase
 * 
 * Run this locally to create all database tables in your Supabase instance.
 * 
 * Prerequisites:
 * 1. Create a .env file with your Supabase DIRECT connection string
 * 2. Run: npx tsx push-schema.ts
 */

// Load .env BEFORE anything else
import dotenv from 'dotenv'
dotenv.config()

import { getPayload } from 'payload'
import config from './src/payload.config'

async function main() {
  const dbUri = process.env.DATABASE_URI || process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL
  
  if (!dbUri) {
    console.error('❌ No database connection string found.')
    console.error('   Set DATABASE_URI in your .env file with the Supabase DIRECT connection (port 5432).')
    process.exit(1)
  }

  // Verify it's using port 5432 (direct, not pooled)
  if (dbUri.includes(':6543/')) {
    console.error('❌ You are using the POOLED connection (port 6543).')
    console.error('   Change to port 5432 for direct connection which supports DDL (CREATE TABLE).')
    process.exit(1)
  }

  console.log('🔌 Connecting to database and pushing schema...')
  console.log(`   Host: ${dbUri.replace(/\/\/[^@]+@/, '//***@')}`)
  
  const payload = await getPayload({ config })
  
  console.log('✅ Schema pushed successfully! All tables created.')
  console.log('   Your Supabase database now has all the Payload CMS tables.')
  
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Failed to push schema:', err.message || err)
  process.exit(1)
})
