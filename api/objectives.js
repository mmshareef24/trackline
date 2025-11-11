import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const VALID_STATUS = new Set([
  'not_started',
  'in_progress',
  'at_risk',
  'completed',
  'archived',
]);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const {
    organizationId,
    year,
    quarter,
    status,
    limit = '50',
    offset = '0',
  } = req.query;

  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200);
  const parsedOffset = Math.max(parseInt(offset, 10) || 0, 0);

  try {
    // Resolve quarter_id if year and quarter are provided
    let quarterId = undefined;
    const yearInt = year ? parseInt(year, 10) : undefined;
    const quarterInt = quarter ? parseInt(quarter, 10) : undefined;

    if (yearInt && quarterInt) {
      const q = await prisma.quarter.findFirst({
        where: { year: yearInt, quarter: quarterInt },
        select: { id: true },
      });
      quarterId = q?.id;
      // If year/quarter provided but not found, return empty result
      if (!quarterId) {
        return res.status(200).json({ count: 0, data: [] });
      }
    }

    const where = {};
    if (organizationId) where.organization_id = String(organizationId);
    if (quarterId) where.quarter_id = quarterId;
    if (status && VALID_STATUS.has(String(status))) where.status = String(status);

    const data = await prisma.objective.findMany({
      where,
      orderBy: { updated_at: 'desc' },
      take: parsedLimit,
      skip: parsedOffset,
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        progress: true,
        owner_id: true,
        department_id: true,
        quarter_id: true,
        created_at: true,
        updated_at: true,
      },
    });

    res.status(200).json({ count: data.length, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await prisma.$disconnect();
  }
}