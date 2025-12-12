import express from 'express';
import { healthCheck } from '../controller/healthController.js';

const router = express.Router();

// Health check endpoint
router.get('/', healthCheck);

export default router;
