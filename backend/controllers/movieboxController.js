import axios from 'axios';

// Streaming endpoint
// Streaming endpoint - with better error handling
export const streamMovieBox = async (req, res) => {
  try {
    const streamUrl = req.query.url;
    
    if (!streamUrl) {
      return res.status(400).json({ error: 'Missing URL' });
    }
    
    console.log(`Stream request for: ${streamUrl.substring(0, 100)}...`);
    
    // Don't try to stream test URLs
    if (streamUrl.includes('example.com')) {
      return res.status(400).json({ error: 'Invalid stream URL' });
    }
    
    // Add CORS headers
    res.set({
      'Access-Control-Allow-Origin': 'https://movie-app-eight-rho-22.vercel.app',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Range',
    });
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    // Try to fetch the video
    const response = await axios({
      method: 'GET',
      url: streamUrl,
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://fmoviesunblocked.net/',
        'Origin': 'https://fmoviesunblocked.net',
      },
      timeout: 10000,
      validateStatus: false // Don't throw on any status
    });
    
    // Check if the response is OK
    if (response.status !== 200) {
      console.log(`Source returned status ${response.status}`);
      return res.status(502).json({ 
        error: 'Video source error', 
        status: response.status 
      });
    }
    
    // Set video headers
    res.set({
      'Content-Type': response.headers['content-type'] || 'video/mp4',
      'Content-Length': response.headers['content-length'],
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-cache',
    });
    
    // Handle range requests (for seeking)
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
    
    // Pipe the stream
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
      res.status(500).json({ 
        error: 'Streaming failed', 
        details: error.message 
      });
    }
  }
};


// Download endpoint - improved version
export const downloadMovieBox = async (req, res) => {
  try {
    const downloadUrl = req.query.url;
    const title = req.query.title || 'video';
    const quality = req.query.quality || '';
    
    if (!downloadUrl) {
      return res.status(400).json({ error: 'Missing URL' });
    }
    
    console.log(`Download request for: ${title} - ${quality}`);
    
    // Create filename
    let filename = title.replace(/[<>:"/\\|?*]/g, '').replace(/\s+/g, '_');
    if (quality) {
      filename += `_${quality}`;
    }
    filename += '.mp4';
    
    // Fetch with better headers
    const response = await axios({
      method: 'GET',
      url: downloadUrl,
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://fmoviesunblocked.net/',
        'Origin': 'https://fmoviesunblocked.net',
        'Accept': '*/*',
      },
      timeout: 60000,
      maxRedirects: 5
    });
    
    // Set headers for download
    res.set({
      'Content-Type': response.headers['content-type'] || 'video/mp4',
      'Content-Length': response.headers['content-length'],
      'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Expose-Headers': 'Content-Disposition',
      'Cache-Control': 'no-cache'
    });
    
    // Pipe the stream
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
      res.status(500).json({ error: 'Download failed', details: error.message });
    }
  }
};