import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    // Simple connectivity check; requires DATABASE_URL to be set
    const result = await prisma.$queryRaw`SELECT 1 as ok`;
    res.status(200).json({ ok: true, result });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  } finally {
    // In serverless environments, you may skip disconnect to reuse connection;
    // here we disconnect to avoid connection leaks in long-lived processes.
    await prisma.$disconnect();
  }
}