import bcrypt from 'bcryptjs'

/**
 * Admin Password Hash Generator
 * ─────────────────────────────
 * Run:  node scripts/seed-admin.js
 *
 * Generates a bcrypt hash of the admin password and prints the value
 * that should be set as ADMIN_PASSWORD_HASH in your .env file.
 */

const PLAINTEXT = process.env.ADMIN_PLAIN_PASS || 'JinaFashion@2026!'
const ROUNDS    = 12

async function generateHash() {
  const hash = await bcrypt.hash(PLAINTEXT, ROUNDS)

  console.log('\n╔══════════════════════════════════════════════════════════════╗')
  console.log('║        Jina Fashion — Admin Credential Generator            ║')
  console.log('╠══════════════════════════════════════════════════════════════╣')
  console.log(`║  Password   : ${PLAINTEXT}`)
  console.log('╠══════════════════════════════════════════════════════════════╣')
  console.log('║  Copy this line to your .env:')
  console.log('║')
  console.log(`║  ADMIN_PASSWORD_HASH=${hash}`)
  console.log('║')
  console.log('╠══════════════════════════════════════════════════════════════╣')
  console.log('║  ⚠  Never commit .env to version control.                  ║')
  console.log('╚══════════════════════════════════════════════════════════════╝\n')
}

generateHash()
