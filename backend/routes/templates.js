const express = require('express');
const router = express.Router();
const { TEMPLATES } = require('../data/templates');

router.get('/', (req, res) => {
  res.json({
    success: true,
    templates: TEMPLATES.map(({ id, name, description, layout }) => ({ id, name, description, layout })),
  });
});

router.get('/:name', (req, res) => {
  const template = TEMPLATES.find(
    (t) => t.id === req.params.name.toLowerCase() || t.name.toLowerCase() === req.params.name.toLowerCase()
  );
  if (!template) return res.status(404).json({ message: 'Template not found' });
  res.json({ success: true, template });
});

module.exports = router;
