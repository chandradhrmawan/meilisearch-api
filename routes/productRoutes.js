import express from 'express';
import { declareIndex, seedData, searchDocuments, reapplySettings } from '../controller/productController.js';

const router = express.Router();

// Declare/Configure index endpoint
router.post('/declare-index', declareIndex);

// reaply settings
router.post('/reapply-settings', reapplySettings);

// Seed data endpoint
router.post('/seed-data', seedData);

// Search documents endpoint
router.post('/search', searchDocuments);

export default router;
