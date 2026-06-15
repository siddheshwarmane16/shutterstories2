import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { AuthenticatedRequest, authenticateJWT, requireAdmin } from '../middleware/auth';

const router = Router();

// GET /api/packages - List all packages
router.get('/', async (req, res) => {
  try {
    const packages = await prisma.package.findMany({
      orderBy: { price: 'asc' },
    });
    return res.json(packages);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error fetching packages' });
  }
});

// POST /api/packages - Admin only - Create a package
router.post('/', authenticateJWT as any, requireAdmin as any, async (req: AuthenticatedRequest, res: Response) => {
  const { name, price, description, features } = req.body;

  if (!name || price === undefined || !description || !features) {
    return res.status(400).json({ error: 'Name, price, description, and features (semicolon-separated) are required' });
  }

  try {
    const pkg = await prisma.package.create({
      data: {
        name,
        price: Number(price),
        description,
        features,
      },
    });
    return res.status(201).json(pkg);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error creating package' });
  }
});

// PUT /api/packages/:id - Admin only - Update a package
router.put('/:id', authenticateJWT as any, requireAdmin as any, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { name, price, description, features } = req.body;

  try {
    const existing = await prisma.package.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Package not found' });
    }

    const pkg = await prisma.package.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existing.name,
        price: price !== undefined ? Number(price) : existing.price,
        description: description !== undefined ? description : existing.description,
        features: features !== undefined ? features : existing.features,
      },
    });

    return res.json(pkg);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error updating package' });
  }
});

// DELETE /api/packages/:id - Admin only - Delete a package
router.delete('/:id', authenticateJWT as any, requireAdmin as any, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.package.delete({ where: { id } });
    return res.json({ message: 'Package deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error deleting package' });
  }
});

export default router;
