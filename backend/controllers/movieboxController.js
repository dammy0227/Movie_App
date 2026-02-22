import axios from 'axios';
import https from 'https';

// Create HTTPS agent that ignores SSL errors
const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
    keepAlive: true
});

// Create a dedicated axios instance for streaming
const streamAxios = axios.create({
    timeout: 30000,
    maxRedirects: 5,
    httpsAgent: httpsAgent
});

// Streaming endpoint
export const streamMovieBox = async (req, res) => {
  try {
    const streamUrl = req.query.url;
    
    if (!streamUrl) {
      return res.status(400).json({ error: 'Missing URL' });
    }
    
    console.log(`Streaming: ${streamUrl.substring(0, 100)}...`);
    
    // Add CORS headers
    res.set({
      'Access-Control-Allow-Origin': 'https://movie-app-eight-rho-22.vercel.app',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Range',
    });
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    const response = await streamAxios({
      method: 'GET',
      url: streamUrl,
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://fmoviesunblocked.net/',
        'Origin': 'https://fmoviesunblocked.net',
      }
    });
    
    if (response.status !== 200) {
      return res.status(502).json({ error: 'Video source error' });
    }
    
    res.set({
      'Content-Type': response.headers['content-type'] || 'video/mp4',
      'Content-Length': response.headers['content-length'],
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-cache',
    });
    
    if (req.headers.range) {
      const range = req.headers.range;
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : response.headers['content-length'] - 1;
      const chunksize = (end - start) + 1;
      
      res.status(206);
      res.set({
        'Content-Range': `bytes ${start}-${end}/${response.headers['content-length']}`,
        'Content-Length': chunksize,
      });
    }
    
    response.data.pipe(res);
    
    response.data.on('error', (error) => {
      console.error('Stream pipe error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Stream failed' });
      }
    });
    
    req.on('close', () => {
      response.data.destroy();
    });
    
  } catch (error) {
    console.error('Stream error:', error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Streaming failed' });
    }
  }
};

// Download endpoint
export const downloadMovieBox = async (req, res) => {
  try {
    const downloadUrl = req.query.url;
    const title = req.query.title || 'video';
    const quality = req.query.quality || '';
    
    if (!downloadUrl) {
      return res.status(400).json({ error: 'Missing URL' });
    }
    
    let filename = title.replace(/[<>:"/\\|?*]/g, '').replace(/\s+/g, '_');
    if (quality) {
      filename += `_${quality}`;
    }
    filename += '.mp4';
    
    const response = await streamAxios({
      method: 'GET',
      url: downloadUrl,
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://fmoviesunblocked.net/',
        'Origin': 'https://fmoviesunblocked.net',
      }
    });
    
    res.set({
      'Content-Type': response.headers['content-type'] || 'video/mp4',
      'Content-Length': response.headers['content-length'],
      'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
      'Access-Control-Allow-Origin': 'https://movie-app-eight-rho-22.vercel.app',
      'Access-Control-Expose-Headers': 'Content-Disposition',
      'Cache-Control': 'no-cache'
    });
    
    response.data.pipe(res);
    
    response.data.on('error', (error) => {
      console.error('Download stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Download failed' });
      }
    });
    
    req.on('close', () => {
      response.data.destroy();
    });
    
  } catch (error) {
    console.error('Download error:', error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Download failed' });
    }
  }
};