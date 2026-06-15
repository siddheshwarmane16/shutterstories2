import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../prisma';
import { AuthenticatedRequest, authenticateJWT, requireAdmin } from '../middleware/auth';

const router = Router();

// POST /api/bookings - Submit booking request (Public)
router.post('/', async (req, res) => {
  const { eventType, date, location, packageId, requirements, contactName, contactEmail, contactPhone } = req.body;

  if (!eventType || !date || !location || !packageId || !contactName || !contactEmail || !contactPhone) {
    return res.status(400).json({ error: 'All fields except requirements are required' });
  }

  try {
    const booking = await prisma.booking.create({
      data: {
        eventType,
        date,
        location,
        packageId,
        requirements,
        contactName,
        contactEmail,
        contactPhone,
        status: 'PENDING',
      },
      include: {
        package: true,
      },
    });

    // Log this lead in analytics
    await prisma.analyticsRecord.create({
      data: {
        metricName: 'LEAD',
        metricValue: 1.0,
      },
    });

    return res.status(201).json(booking);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error creating booking' });
  }
});

// GET /api/bookings - Admin only - List all bookings
router.get('/', authenticateJWT as any, requireAdmin as any, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        package: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return res.json(bookings);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error listing bookings' });
  }
});

// PUT /api/bookings/:id - Admin only - Update booking status & auto-provision client portal resources
router.put('/:id', authenticateJWT as any, requireAdmin as any, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body; // e.g. "APPROVED", "COMPLETED", "CANCELLED", "IN_PROGRESS"

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { package: true },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: { package: true },
    });

    // Auto-create client profile, invoice and project status if status is approved
    if (status === 'APPROVED') {
      // 1. Find or create client User account
      let user = await prisma.user.findUnique({
        where: { email: booking.contactEmail },
      });

      if (!user) {
        // Create a default client account with a simple default password
        const passwordHash = await bcrypt.hash('shutter123', 10);
        user = await prisma.user.create({
          data: {
            email: booking.contactEmail,
            name: booking.contactName,
            passwordHash,
            role: 'CLIENT',
          },
        });
      }

      // 2. Create invoice for the booking amount
      const existingInvoices = await prisma.invoice.findFirst({
        where: { bookingId: booking.id },
      });

      if (!existingInvoices) {
        await prisma.invoice.create({
          data: {
            bookingId: booking.id,
            amount: booking.package.price,
            status: 'UNPAID',
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days due
          },
        });
      }

      // 3. Create project tracking pipeline
      const existingProject = await prisma.projectStatus.findFirst({
        where: { bookingId: booking.id },
      });

      if (!existingProject) {
        await prisma.projectStatus.create({
          data: {
            clientId: user.id,
            bookingId: booking.id,
            phase: 'SHOOTING',
            percentage: 15,
            comments: 'Booking approved. Pre-production planning and equipment check initiated.',
          },
        });
      }

      // 4. Log booking revenue in analytics
      await prisma.analyticsRecord.create({
        data: {
          metricName: 'REVENUE',
          metricValue: booking.package.price,
        },
      });

      // Log success booking hit
      await prisma.analyticsRecord.create({
        data: {
          metricName: 'BOOKING',
          metricValue: 1.0,
        },
      });
    }

    return res.json(updatedBooking);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error updating booking' });
  }
});

export default router;
