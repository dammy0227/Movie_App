import express from 'express';
const router = express.Router();
import { 
    streamMovieBox, 
    downloadMovieBox,
    testConnection 
} from '../controllers/movieboxController.js';

// Streaming and download endpoints
router.get('/stream', streamMovieBox);
router.get('/download', downloadMovieBox);

// Test endpoint
router.get('/test-connection', testConnection);

export default router;