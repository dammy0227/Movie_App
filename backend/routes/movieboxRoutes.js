import express from 'express';
const router = express.Router();
import { streamMovieBox, downloadMovieBox } from '../controllers/movieboxController.js';


router.get('/stream', streamMovieBox);
router.get('/download', downloadMovieBox);

export default router;