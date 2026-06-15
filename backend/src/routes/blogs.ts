import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { AuthenticatedRequest, authenticateJWT, requireAdmin } from '../middleware/auth';

const router = Router();

// GET /api/blogs - List all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany({
      include: {
        author: {
          select: { name: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return res.json(blogs);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error fetching blogs' });
  }
});

// GET /api/blogs/:id - Get single blog post
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        author: {
          select: { name: true },
        },
      },
    });

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    return res.json(blog);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error fetching blog post' });
  }
});

// POST /api/blogs - Admin only - Create a blog post
router.post('/', authenticateJWT as any, requireAdmin as any, async (req: AuthenticatedRequest, res: Response) => {
  const { title, content, featuredImage, category, tags, seoTitle, seoDesc } = req.body;

  if (!title || !content || !featuredImage || !category) {
    return res.status(400).json({ error: 'Title, content, featuredImage, and category are required' });
  }

  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        featuredImage,
        category,
        tags: tags || '',
        authorId: req.user.id,
        seoTitle: seoTitle || title,
        seoDesc: seoDesc || '',
      },
    });

    return res.status(201).json(blog);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error creating blog' });
  }
});

// PUT /api/blogs/:id - Admin only - Update a blog post
router.put('/:id', authenticateJWT as any, requireAdmin as any, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { title, content, featuredImage, category, tags, seoTitle, seoDesc } = req.body;

  try {
    const existing = await prisma.blog.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existing.title,
        content: content !== undefined ? content : existing.content,
        featuredImage: featuredImage !== undefined ? featuredImage : existing.featuredImage,
        category: category !== undefined ? category : existing.category,
        tags: tags !== undefined ? tags : existing.tags,
        seoTitle: seoTitle !== undefined ? seoTitle : existing.seoTitle,
        seoDesc: seoDesc !== undefined ? seoDesc : existing.seoDesc,
      },
    });

    return res.json(blog);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error updating blog' });
  }
});

// DELETE /api/blogs/:id - Admin only - Delete a blog post
router.delete('/:id', authenticateJWT as any, requireAdmin as any, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.blog.delete({ where: { id } });
    return res.json({ message: 'Blog deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error deleting blog' });
  }
});

export default router;
