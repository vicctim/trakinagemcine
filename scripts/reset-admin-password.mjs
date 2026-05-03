#!/usr/bin/env node
/**
 * Reset admin password via Payload direct DB update using scrypt
 * Run: node scripts/reset-admin-password.mjs
 */
import { scrypt, randomBytes } from 'crypto'
import { promisify } from 'util'
import pg from 'pg'

const scryptAsync = promisify(scrypt)

const NEW_PASSWORD = 'Trakinagem@2025'
const ADMIN_EMAIL  = 'victor@victorsamuel.com.br'

async function main() {
  const salt = randomBytes(32).toString('hex')
  const hashBuf = await scryptAsync(NEW_PASSWORD, salt, 64)
  const hash = hashBuf.toString('hex')

  const client = new pg.Client({
    connectionString: process.env.DATABASE_URI,
  })
  await client.connect()
  
  const res = await client.query(
    'UPDATE users SET hash = $1, salt = $2 WHERE email = $3 RETURNING id, email',
    [hash, salt, ADMIN_EMAIL]
  )
  
  if (res.rowCount === 0) {
    console.error('❌ User not found:', ADMIN_EMAIL)
  } else {
    console.log('✅ Password reset successfully for:', res.rows[0].email)
    console.log('   New password:', NEW_PASSWORD)
  }
  
  await client.end()
}

main().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
