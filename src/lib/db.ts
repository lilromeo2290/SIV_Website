import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'
import { existsSync } from 'fs'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  dbInitialized: boolean
}

// In production (Vercel), use /tmp which is the only writable directory
if (process.env.NODE_ENV === 'production') {
  process.env.DATABASE_URL = 'file:/tmp/crm.db'
}

function createPrismaClient() {
  // On Vercel, ensure the database schema exists before creating the client
  if (process.env.NODE_ENV === 'production' && !globalForPrisma.dbInitialized) {
    try {
      const dbPath = '/tmp/crm.db'
      if (!existsSync(dbPath)) {
        // Create empty SQLite file so Prisma can connect
        require('fs').writeFileSync(dbPath, '')
      }
      // Push the schema to the database (creates/updates tables)
      const prismaCli = require.resolve('prisma')
      execSync(
        `node ${prismaCli} db push --skip-generate --accept-data-loss`,
        { stdio: 'ignore', timeout: 15000 }
      )
      globalForPrisma.dbInitialized = true
    } catch (e) {
      console.error('Failed to initialize database schema:', e)
    }
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  })
}

export const db =
  globalForPrisma.prisma ??
  createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
