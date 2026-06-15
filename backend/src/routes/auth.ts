import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';
import { AuthenticatedRequest, authenticateJWT } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev_only';

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password, role, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userRole = role === 'ADMIN' ? 'ADMIN' : 'CLIENT';

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: userRole,
        name,
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error registering user' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error logging in' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateJWT as any, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error fetching user' });
  }
});

export default router;
