const express = require('express');
const router = express.Router();
const Page = require('../models/Page');
const ContactSubmission = require('../models/ContactSubmission');

router.get('/:slug', async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug, status: 'published' });
    if (!page) {
      return res.status(404).json({ error: 'Page not found or not published' });
    }
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:slug/view', async (req, res) => {
  try {
    const page = await Page.findOneAndUpdate(
      { slug: req.params.slug, status: 'published' },
      { $inc: { viewCount: 1 } },
      { new: true }
    );
    if (!page) return res.status(404).json({ error: 'Page not found or not published' });
    res.json({ message: 'View counted', viewCount: page.viewCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:slug/contact', async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug, status: 'published' });
    if (!page) return res.status(404).json({ error: 'Page not found or not published' });

    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please provide name, email and message' });
    }

    const submission = await ContactSubmission.create({
      pageId: page._id,
      name,
      email,
      message,
    });

    res.status(201).json({ message: 'Message sent successfully', submissionId: submission._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
