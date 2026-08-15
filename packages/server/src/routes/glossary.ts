import { Router } from 'express';
import { GLOSSARY_TERMS } from '../data/seed/glossary.js';

export const glossaryRouter = Router();

// GET /api/v1/glossary
glossaryRouter.get('/', (req, res) => {
  const query = (req.query.q as string || '').toLowerCase().trim();
  const category = req.query.category as string;

  let filtered = GLOSSARY_TERMS;

  if (category) {
    filtered = filtered.filter(t => t.category === category);
  }

  if (query) {
    filtered = filtered.filter(t =>
      t.term.toLowerCase().includes(query) ||
      (t.abbreviation && t.abbreviation.toLowerCase().includes(query)) ||
      t.definition.toLowerCase().includes(query)
    );
  }

  res.json({
    success: true,
    count: filtered.length,
    data: filtered
  });
});
