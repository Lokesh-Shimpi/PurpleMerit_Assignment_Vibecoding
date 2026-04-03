const express = require('express');
const router = express.Router();
const Page = require('../models/Page');
const auth = require('../middleware/auth');

// All routes require auth
router.use(auth);

// Helper to check ownership
const checkOwnership = (page, userId) => {
  if (page.userId.toString() !== userId.toString()) {
    throw new Error('Not authorized to access this page');
  }
};

router.get('/', async (req, res) => {
  try {
    const pages = await Page.find({ userId: req.user._id });
    res.json(pages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, slug, theme, sections } = req.body;
    
    // Check slug uniqueness
    const existing = await Page.findOne({ slug });
    if (existing) {
       return res.status(400).json({ error: 'Slug must be unique' });
    }

    const page = await Page.create({
      userId: req.user._id,
      title,
      slug,
      theme,
      sections,
    });
    res.status(201).json(page);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ error: 'Page not found' });
    checkOwnership(page, req.user._id);
    res.json(page);
  } catch (error) {
    if (error.message.includes('Not authorized')) {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    let page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ error: 'Page not found' });
    checkOwnership(page, req.user._id);

    const { title, theme, sections } = req.body;
    if (title) page.title = title;
    if (theme) page.theme = theme;
    if (sections) page.sections = sections;

    await page.save();
    res.json(page);
  } catch (error) {
    if (error.message.includes('Not authorized')) {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/publish', async (req, res) => {
  try {
    let page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ error: 'Page not found' });
    checkOwnership(page, req.user._id);
    
    page.status = 'published';
    await page.save();
    res.json(page);
  } catch (error) {
    if (error.message.includes('Not authorized')) {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/unpublish', async (req, res) => {
  try {
    let page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ error: 'Page not found' });
    checkOwnership(page, req.user._id);
    
    page.status = 'draft';
    await page.save();
    res.json(page);
  } catch (error) {
    if (error.message.includes('Not authorized')) {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/duplicate', async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ error: 'Page not found' });
    checkOwnership(page, req.user._id);

    const uniqueId = Math.random().toString(36).substr(2, 5);
    const newSlug = `${page.slug}-copy-${uniqueId}`;

    const newPage = await Page.create({
      userId: req.user._id,
      title: `${page.title} (Copy)`,
      slug: newSlug,
      status: 'draft',
      theme: page.theme,
      sections: page.sections,
    });

    res.status(201).json(newPage);
  } catch (error) {
    if (error.message.includes('Not authorized')) {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ error: 'Page not found' });
    checkOwnership(page, req.user._id);

    await Page.findByIdAndDelete(req.params.id);
    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    if (error.message.includes('Not authorized')) {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
