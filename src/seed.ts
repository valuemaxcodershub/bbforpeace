/**
 * Seed Script for BBFORPEACE
 * 
 * This script creates the default super admin user if none exists.
 * Run with: npm run seed
 * 
 * Environment variables required:
 * - PAYLOAD_SECRET: Your Payload secret key
 * - SUPER_ADMIN_EMAIL: Email for super admin (default: admin@bbforpeace.org)
 * - SUPER_ADMIN_PASSWORD: Password for super admin (default: ChangeMe123!)
 */

import { getPayload } from 'payload'
import config from './payload.config'

const seed = async () => {
  console.log('🌱 Starting seed process...')
  
  const payload = await getPayload({ config })
  
  // Super admin credentials from environment (NO hardcoded defaults)
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'superadmin@bbforpeace.org'
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD
  const superAdminName = process.env.SUPER_ADMIN_NAME || 'Super Administrator'

  if (!superAdminPassword) {
    console.error('❌ SUPER_ADMIN_PASSWORD environment variable is required.')
    console.error('   Set it before running seed: export SUPER_ADMIN_PASSWORD="YourStrongPassword123!"')
    process.exit(1)
  }

  if (superAdminPassword.length < 12) {
    console.error('❌ SUPER_ADMIN_PASSWORD must be at least 12 characters.')
    process.exit(1)
  }
  
  try {
    // Check if any super admin exists
    const existingSuperAdmins = await payload.find({
      collection: 'users',
      where: {
        role: {
          equals: 'super-admin',
        },
      },
      limit: 1,
    })
    
    if (existingSuperAdmins.docs.length > 0) {
      console.log('✅ Super admin already exists. Skipping creation.')
      console.log(`   Email: ${existingSuperAdmins.docs[0].email}`)
    } else {
      // Check if the email is already in use
      const existingUser = await payload.find({
        collection: 'users',
        where: {
          email: {
            equals: superAdminEmail,
          },
        },
        limit: 1,
      })
      
      if (existingUser.docs.length > 0) {
        // Update existing user to super admin
        await payload.update({
          collection: 'users',
          id: existingUser.docs[0].id,
          data: {
            role: 'super-admin',
            name: superAdminName,
            isActive: true,
          },
        })
        console.log('✅ Existing user upgraded to Super Admin.')
        console.log(`   Email: ${superAdminEmail}`)
      } else {
        // Create new super admin
        const superAdmin = await payload.create({
          collection: 'users',
          data: {
            email: superAdminEmail,
            password: superAdminPassword,
            name: superAdminName,
            role: 'super-admin',
            isActive: true,
          },
        })
        
        console.log('✅ Super Admin created successfully!')
        console.log(`   Email: ${superAdmin.email}`)
        console.log('')
        console.log('⚠️  IMPORTANT: Change the password immediately after first login!')
      }
    }
    
    console.log('')
    console.log('🎉 Seed completed successfully!')
    
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    process.exit(1)
  }
  
  process.exit(0)
}

seed()
