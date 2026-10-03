const express = require('express');
const router  = express.Router();
const path    = require('path');
const fs      = require('fs');

const load = (file) => JSON.parse(fs.readFileSync(path.join(__dirname, '../data', file), 'utf8'));

// GET /api/questions  — optional ?skill=JavaScript&difficulty=Beginner
router.get('/questions', (req, res) => {
  try {
    let data = load('questions.json');
    const { skill, difficulty } = req.query;
    if (skill)       data = data.filter(q => q.skill.toLowerCase() === skill.toLowerCase());
    if (difficulty)  data = data.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
    res.json({ success: true, count: data.length, data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Could not load questions.' });
  }
});

// GET /api/questions/:id
router.get('/questions/:id', (req, res) => {
  try {
    const data = load('questions.json');
    const q = data.find(q => q.id === parseInt(req.params.id));
    if (!q) return res.status(404).json({ success: false, message: 'Question not found.' });
    res.json({ success: true, data: q });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Could not load question.' });
  }
});

// GET /api/careers  — optional ?id=fullstack
router.get('/careers', (req, res) => {
  try {
    let data = load('careers.json');
    const { id } = req.query;
    if (id) data = data.filter(c => c.id === id);
    res.json({ success: true, count: data.length, data });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Could not load careers.' });
  }
});

// GET /api/careers/:id
router.get('/careers/:id', (req, res) => {
  try {
    const data = load('careers.json');
    const c = data.find(c => c.id === req.params.id);
    if (!c) return res.status(404).json({ success: false, message: 'Career not found.' });
    res.json({ success: true, data: c });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Could not load career.' });
  }
});

// GET /api/skills  — optional ?category=Web Development
router.get('/skills', (req, res) => {
  try {
    let data = load('skills.json');
    const { category } = req.query;
    if (category) data = data.filter(s => s.category.toLowerCase() === category.toLowerCase());
    res.json({ success: true, count: data.length, data });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Could not load skills.' });
  }
});

// GET /api/skills/:id
router.get('/skills/:id', (req, res) => {
  try {
    const data = load('skills.json');
    const s = data.find(s => s.id === req.params.id);
    if (!s) return res.status(404).json({ success: false, message: 'Skill not found.' });
    res.json({ success: true, data: s });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Could not load skill.' });
  }
});

module.exports = router;
