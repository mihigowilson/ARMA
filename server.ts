import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_MODELS,
  INITIAL_AGENCIES,
  INITIAL_SCOUTS,
  INITIAL_CASTINGS,
  INITIAL_EVENTS,
  INITIAL_NEWS,
  INITIAL_DOCUMENTS,
  INITIAL_CERTIFICATES,
  DEMO_USER_ADMIN,
  DEMO_USER_MODEL
} from './src/data/mockData.js';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.disable('x-powered-by');
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    next();
  });
  app.use(express.json({ limit: '100kb' }));

  const requestCounts = new Map<string, { count: number; resetAt: number }>();
  app.use('/api', (req, res, next) => {
    const now = Date.now();
    const key = req.ip || 'unknown';
    const current = requestCounts.get(key);
    if (!current || current.resetAt <= now) {
      requestCounts.set(key, { count: 1, resetAt: now + 60_000 });
      return next();
    }
    if (current.count >= 120) {
      return res.status(429).json({ message: 'Too many requests. Try again later.' });
    }
    current.count += 1;
    return next();
  });

  // In-memory data store for live CRUD during session
  let modelsList = [...INITIAL_MODELS];
  let agenciesList = [...INITIAL_AGENCIES];
  let castingsList = [...INITIAL_CASTINGS];
  let eventsList = [...INITIAL_EVENTS];
  let newsList = [...INITIAL_NEWS];
  let certificatesList = [...INITIAL_CERTIFICATES];
  let applicationsList: any[] = [];

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', organization: 'ARMA Rwanda' });
  });

  // Models Endpoint
  app.get('/api/models', (req, res) => {
    res.json(modelsList);
  });

  app.post('/api/models', (req, res) => {
    const newModel = { id: `mod-${Date.now()}`, ...req.body };
    modelsList.unshift(newModel);
    res.status(201).json(newModel);
  });

  app.get('/api/models/:id', (req, res) => {
    const model = modelsList.find((m) => m.id === req.params.id);
    if (!model) return res.status(404).json({ message: 'Model not found' });
    res.json(model);
  });

  // Agencies Endpoint
  app.get('/api/agencies', (req, res) => {
    res.json(agenciesList);
  });

  // Castings Endpoint
  app.get('/api/castings', (req, res) => {
    res.json(castingsList);
  });

  app.post('/api/castings', (req, res) => {
    const newCasting = { id: `cast-${Date.now()}`, applicantsCount: 0, status: 'Open', ...req.body };
    castingsList.unshift(newCasting);
    res.status(201).json(newCasting);
  });

  // Events Endpoint
  app.get('/api/events', (req, res) => {
    res.json(eventsList);
  });

  // News Endpoint
  app.get('/api/news', (req, res) => {
    res.json(newsList);
  });

  // Verification Endpoint
  app.get('/api/verify/:code', (req, res) => {
    const code = req.params.code.trim().toUpperCase();
    const foundCert = certificatesList.find((c) => c.certificateNumber.toUpperCase() === code);
    if (foundCert) {
      return res.json({ found: true, type: 'Certificate', record: foundCert });
    }
    const foundModel = modelsList.find((m) => m.id.toUpperCase() === code || m.fullName.toUpperCase().includes(code));
    if (foundModel) {
      return res.json({ found: true, type: 'Member ID', record: foundModel });
    }
    res.status(404).json({ found: false, message: 'No record matching code' });
  });

  // Applications Endpoint
  app.get('/api/applications', (req, res) => {
    res.json(applicationsList);
  });

  app.post('/api/applications', (req, res) => {
    const newApp = {
      id: `app-${Date.now()}`,
      status: 'Pending',
      submittedAt: new Date().toISOString().split('T')[0],
      ...req.body
    };
    applicationsList.unshift(newApp);
    res.status(201).json(newApp);
  });

  // Gemini AI Bio / Portfolio Generator Endpoint
  app.post('/api/gemini/generate-bio', async (req, res) => {
    try {
      const { fullName, category, experienceYears, achievements, promptText } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        // Fallback generator when key is unconfigured
        const fallbackBio = `${fullName} is a distinguished ${experienceYears || 2}-year ${category || 'Fashion'} model based in Rwanda. Known for poise, professionalism, and runway presence, ${fullName} is dedicated to elevating Rwandan high fashion on national and international stages.`;
        return res.json({ bio: fallbackBio });
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an elite fashion modeling copywriter for ARMA (Association of Rwanda Models & Agencies). Generate a compelling, high-fashion 3-sentence biography and comp-card summary for a Rwandan model.
Model Name: ${fullName}
Category: ${category}
Experience: ${experienceYears} years
Achievements: ${Array.isArray(achievements) ? achievements.join(', ') : achievements || 'None listed'}
Special Instructions: ${promptText || 'Make it sound elegant, luxurious, and international.'}`
      });

      const generatedText = response.text || 'High fashion model representing Rwanda grace and international standards.';
      res.json({ bio: generatedText.trim() });
    } catch (err: any) {
      console.error('Gemini error:', err);
      res.status(500).json({ error: 'Failed to generate bio via AI', fallback: 'Professional Rwandan fashion model.' });
    }
  });

  // Vite Middleware for development mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ARMA Rwanda Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
