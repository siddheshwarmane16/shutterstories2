import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { AuthenticatedRequest, authenticateJWT, requireAdmin } from '../middleware/auth';

const router = Router();

// GET /api/portal/project - Client-only - Fetch project pipeline progress
router.get('/project', authenticateJWT as any, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const project = await prisma.projectStatus.findFirst({
      where: { clientId: req.user.id },
      include: {
        booking: {
          include: {
            package: true,
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'No active project found for this account' });
    }

    return res.json(project);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error fetching project status' });
  }
});

// GET /api/portal/invoices - Client-only - List invoices
router.get('/invoices', authenticateJWT as any, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        contactEmail: req.user.email,
      },
      select: { id: true },
    });

    const bookingIds = bookings.map((b) => b.id);

    const invoices = await prisma.invoice.findMany({
      where: {
        bookingId: { in: bookingIds },
      },
      include: {
        booking: {
          select: {
            eventType: true,
            date: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(invoices);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error fetching invoices' });
  }
});

// POST /api/portal/invoices/:id/pay - Client-only - Pay invoice (Mocked payment simulation)
router.post('/invoices/:id/pay', authenticateJWT as any, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { booking: true },
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const updated = await prisma.invoice.update({
      where: { id },
      data: { status: 'PAID' },
    });

    return res.json({ success: true, message: 'Payment simulated successfully', invoice: updated });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error processing payment' });
  }
});

// GET /api/portal/chat - Fetch direct messages between Client and Photographer/Admin
router.get('/chat', authenticateJWT as any, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    let chatPartnerId = String(req.query.partnerId);

    if (req.user.role === 'CLIENT') {
      const adminUser = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
        select: { id: true },
      });
      if (adminUser) {
        chatPartnerId = adminUser.id;
      } else {
        return res.json([]); // No admins seeded yet
      }
    } else {
      if (!req.query.partnerId || req.query.partnerId === 'undefined') {
        return res.status(400).json({ error: 'partnerId is required for admin' });
      }
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user.id, receiverId: chatPartnerId },
          { senderId: chatPartnerId, receiverId: req.user.id },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });

    return res.json(messages);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error fetching chat messages' });
  }
});

// POST /api/portal/chat - Send a message
router.post('/chat', authenticateJWT as any, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const { content, receiverId } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Message content is required' });
  }

  let finalReceiverId = receiverId;

  try {
    if (req.user.role === 'CLIENT') {
      const adminUser = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
        select: { id: true },
      });
      if (!adminUser) {
        return res.status(404).json({ error: 'Photographer is currently unavailable' });
      }
      finalReceiverId = adminUser.id;
    } else {
      if (!finalReceiverId) {
        return res.status(400).json({ error: 'receiverId is required for admin' });
      }
    }

    const msg = await prisma.message.create({
      data: {
        senderId: req.user.id,
        receiverId: finalReceiverId,
        content,
      },
    });

    return res.status(201).json(msg);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error sending message' });
  }
});

// GET /api/portal/admin/projects - Admin only - List all project trackers
router.get('/admin/projects', authenticateJWT as any, requireAdmin as any, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const projects = await prisma.projectStatus.findMany({
      include: {
        client: {
          select: { name: true, email: true, id: true },
        },
        booking: {
          include: { package: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
    return res.json(projects);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error listing projects' });
  }
});

// PUT /api/portal/admin/projects/:id - Admin only - Update project tracker details
router.put('/admin/projects/:id', authenticateJWT as any, requireAdmin as any, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { phase, percentage, comments, deliverables } = req.body;

  try {
    const existing = await prisma.projectStatus.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Project tracker not found' });
    }

    const updated = await prisma.projectStatus.update({
      where: { id },
      data: {
        phase: phase !== undefined ? phase : existing.phase,
        percentage: percentage !== undefined ? Number(percentage) : existing.percentage,
        comments: comments !== undefined ? comments : existing.comments,
        deliverables: deliverables !== undefined ? deliverables : existing.deliverables,
      },
    });

    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error updating project details' });
  }
});

export default router;
