import axios from 'axios';

// Streaming endpoint
export const streamMovieBox = async (req, res) => {
  try {
    const streamUrl = req.query.url;
    
    if (!streamUrl) {
      return res.status(400).json({ error: 'Missing URL' });
    }
    
    console.log(`Streaming: ${streamUrl.substring(0, 100)}...`);
    
    const response = await axios({
      method: 'GET',
      url: streamUrl,
      responseType: 'stream',
      headers: {
        'User-Agent': 'okhttp/4.12.0',
        'Referer': 'https://fmoviesunblocked.net/'
      }
    });
    
    res.set({
      'Content-Type': response.headers['content-type'] || 'video/mp4',
      'Content-Length': response.headers['content-length'],
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-cache'
    });
    
    response.data.pipe(res);
    
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