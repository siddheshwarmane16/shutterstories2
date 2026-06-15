import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { AuthenticatedRequest, authenticateJWT, requireAdmin } from '../middleware/auth';

const router = Router();

// GET /api/testimonials - List all testimonials
router.get('/', async (req, res) => {
  try {
    const list = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.json(list);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error fetching testimonials' });
  }
});

// POST /api/testimonials - Admin only - Create a testimonial
router.post('/', authenticateJWT as any, requireAdmin as any, async (req: AuthenticatedRequest, res: Response) => {
  const { clientName, clientRole, rating, reviewText, videoUrl, avatarUrl } = req.body;

  if (!clientName || !reviewText) {
    return res.status(400).json({ error: 'Client name and reviewText are required' });
  }

  try {
    const t = await prisma.testimonial.create({
      data: {
        clientName,
        clientRole,
        rating: rating !== undefined ? Number(rating) : 5,
        reviewText,
        videoUrl,
        avatarUrl,
      },
    });
    return res.status(201).json(t);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error creating testimonial' });
  }
});

// PUT /api/testimonials/:id - Admin only - Update a testimonial
router.put('/:id', authenticateJWT as any, requireAdmin as any, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { clientName, clientRole, rating, reviewText, videoUrl, avatarUrl } = req.body;

  try {
    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    const t = await prisma.testimonial.update({
      where: { id },
      data: {
        clientName: clientName !== undefined ? clientName : existing.clientName,
        clientRole: clientRole !== undefined ? clientRole : existing.clientRole,
        rating: rating !== undefined ? Number(rating) : existing.rating,
        reviewText: reviewText !== undefined ? reviewText : existing.reviewText,
        videoUrl: videoUrl !== undefined ? videoUrl : existing.videoUrl,
        avatarUrl: avatarUrl !== undefined ? avatarUrl : existing.avatarUrl,
      },
    });

    return res.json(t);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error updating testimonial' });
  }
});

// DELETE /api/testimonials/:id - Admin only - Delete a testimonial
router.delete('/:id', authenticateJWT as any, requireAdmin as any, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.testimonial.delete({ where: { id } });
    return res.json({ message: 'Testimonial deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error deleting testimonial' });
  }
});

export default router;
