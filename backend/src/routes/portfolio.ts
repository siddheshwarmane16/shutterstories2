import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { AuthenticatedRequest, authenticateJWT, requireAdmin } from '../middleware/auth';

const router = Router();

// GET /api/portfolio - List all portfolio items with search and filter
router.get('/', async (req, res) => {
  const { category, search } = req.query;

  try {
    let whereClause: any = {};

    if (category) {
      whereClause.category = {
        slug: String(category),
      };
    }

    if (search) {
      const searchStr = String(search).toLowerCase();
      whereClause.OR = [
        { title: { contains: searchStr } },
        { description: { contains: searchStr } },
        { category: { name: { contains: searchStr } } },
      ];
    }

    const items = await prisma.portfolio.findMany({
      where: whereClause,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (search) {
      await prisma.analyticsRecord.create({
        data: {
          metricName: 'SEARCH',
          metricValue: 1.0,
        },
      });
    }

    return res.json(items);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error fetching portfolio' });
  }
});

// GET /api/portfolio/categories - List all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { items: true },
        },
      },
    });
    return res.json(categories);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error fetching categories' });
  }
});

// POST /api/portfolio - Admin only - Create a portfolio item
router.post('/', authenticateJWT as any, requireAdmin as any, async (req: AuthenticatedRequest, res: Response) => {
  const { title, description, mediaUrl, mediaType, categoryId, featured } = req.body;

  if (!title || !mediaUrl || !mediaType || !categoryId) {
    return res.status(400).json({ error: 'Title, mediaUrl, mediaType, and categoryId are required' });
  }

  try {
    const item = await prisma.portfolio.create({
      data: {
        title,
        description,
        mediaUrl,
        mediaType,
        categoryId,
        featured: !!featured,
      },
      include: {
        category: true,
      },
    });
    return res.status(201).json(item);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error creating portfolio item' });
  }
});

// DELETE /api/portfolio/:id - Admin only - Delete a portfolio item
router.delete('/:id', authenticateJWT as any, requireAdmin as any, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.portfolio.delete({ where: { id } });
    return res.json({ message: 'Portfolio item deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error deleting portfolio item' });
  }
});

// POST /api/portfolio/categories - Admin only - Create a category
router.post('/categories', authenticateJWT as any, requireAdmin as any, async (req: AuthenticatedRequest, res: Response) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  try {
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    const cat = await prisma.category.create({
      data: {
        name,
        slug,
      },
    });
    return res.status(201).json(cat);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error creating category' });
  }
});

export default router;
