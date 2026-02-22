import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import https from 'https';
import { randomBytes } from 'crypto';

// Configuration
const MIRROR_HOSTS = [
    "h5.aoneroom.com",
    "movieboxapp.in", 
    "moviebox.pk",
    "moviebox.ph",
    "moviebox.id",
    "v.moviebox.ph"
];

// Rotating user agents to avoid detection
const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0',
    'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0'
];

// Generate a random session ID
const generateSessionId = () => {
    return randomBytes(16).toString('hex');
};

// Store session info
let currentSessionId = generateSessionId();
let currentWorkingHost = null;
let cookiesInitialized = false;
let lastRequestTime = 0;
const RATE_LIMIT_DELAY = 8000; // Increased to 8 seconds to be safer

// Get random user agent
const getRandomUserAgent = () => {
    return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
};

// Enhanced headers that mimic a real browser more closely
const getEnhancedHeaders = (host, referer = null) => {
    const timestamp = Date.now();
    const sessionId = currentSessionId;
    
    return {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9,es;q=0.8,fr;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'User-Agent': getRandomUserAgent(),
        'X-Client-Info': `{"timezone":"Africa/Nairobi","session":"${sessionId}","timestamp":${timestamp}}`,
        'X-Requested-With': 'XMLHttpRequest',
        'Connection': 'keep-alive',
        'Host': host,
        'Origin': `https://${host}`,
        'Referer': referer || `https://${host}/`,
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'X-Forwarded-For': `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        'CF-Connecting-IP': `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        'X-Real-IP': `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
    };
};

// Create HTTPS agent that ignores SSL errors
const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
    keepAlive: true
});

// Session management
const jar = new CookieJar();

// Cookie-based axios instance
const cookieAxios = wrapper(axios.create({
    jar,
    withCredentials: true,
    timeout: 30000
}));

// Alternative API endpoints to try
const ALTERNATIVE_ENDPOINTS = [
    '/wefeed-h5-bff/web/subject/download',
    '/wefeed-h5-bff/api/subject/download',
    '/api/v1/subject/download',
    '/wefeed/api/subject/download',
    '/wefeed-h5-bff/web/resource/download',
    '/api/resource/download'
];

// Additional referer domains
const REFERER_DOMAINS = [
    'https://fmoviesunblocked.net',
    'https://fmovies.to',
    'https://fmovies.hn',
    'https://moviebox.ph',
    'https://moviebox.pk',
    'https://moviebox.app',
    'https://h5.aoneroom.com',
    'https://www.google.com',
    'https://www.bing.com',
    'https://www.youtube.com',
    'https://www.netflix.com'
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function rateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
        await sleep(RATE_LIMIT_DELAY - timeSinceLastRequest);
    }
    lastRequestTime = Date.now();
}

function processApiResponse(response) {
    if (response.data && response.data.data) {
        return response.data.data;
    }
    return response.data || response;
}

async function ensureCookiesAreAssigned() {
    if (!cookiesInitialized) {
        console.log('🔄 Initializing MovieBox session...');
        
        for (const host of MIRROR_HOSTS) {
            try {
                console.log(`Trying host: ${host}`);
                await rateLimit();
                
                const headers = getEnhancedHeaders(host);
                const response = await cookieAxios.get(`https://${host}/wefeed-h5-bff/app/get-latest-app-pkgs?app_name=moviebox`, {
                    headers: headers,
                    timeout: 10000
                });
                
                if (response && response.data) {
                    console.log(`✅ Session initialized with host: ${host}`);
                    cookiesInitialized = true;
                    currentWorkingHost = host;
                    return true;
                }
            } catch (error) {
                console.log(`❌ Failed to initialize with host ${host}:`, error.message);
                continue;
            }
        }
        console.log('❌ All hosts failed to initialize');
    }
    return cookiesInitialized;
}

async function makeApiRequest(url, options = {}) {
    await ensureCookiesAreAssigned();
    await rateLimit();
    
    // Extract host from URL
    const host = new URL(url).hostname;
    
    // Rotate session ID occasionally
    if (Math.random() > 0.8) {
        currentSessionId = generateSessionId();
        console.log('🔄 Rotated session ID');
    }
    
    // Generate fresh headers for each request
    const headers = {
        ...getEnhancedHeaders(host),
        ...options.headers
    };
    
    const config = {
        url: url,
        headers: headers,
        withCredentials: true,
        ...options
    };
    
    // Try with multiple user agents if first attempt fails
    const maxRetries = 3;
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await cookieAxios(config);
            return response;
        } catch (error) {
            if (error.response?.status === 403 && i < maxRetries - 1) {
                console.log(`Got 403, retrying with different user agent (${i + 1}/${maxRetries})...`);
                // Change user agent for retry
                config.headers['User-Agent'] = getRandomUserAgent();
                // Add a small delay before retry
                await sleep(3000);
                continue;
            }
            throw error;
        }
    }
}

// Search MovieBox by title
export const searchMovieBox = async (title, year = null) => {
    try {
        const payload = {
            keyword: title,
            page: 1,
            perPage: 10,
            subjectType: 0 
        };
        
        let response = null;
        let lastError = null;
        
        for (const host of MIRROR_HOSTS) {
            try {
                console.log(`Searching on host: ${host}`);
                response = await makeApiRequest(`https://${host}/wefeed-h5-bff/web/subject/search`, {
                    method: 'POST',
                    data: payload,
                    timeout: 10000
                });
                if (response) break;
            } catch (error) {
                lastError = error;
                console.log(`Search failed on ${host}:`, error.message);
                continue;
            }
        }
        
        if (!response) {
            console.log('All hosts failed for search');
            return [];
        }
        
        const content = processApiResponse(response);
        
        const results = (content.items || []).map(item => ({
            id: item.subjectId || item.id,
            title: item.title,
            type: item.subjectType === 1 ? 'movie' : 'tv',
            year: item.year,
            description: item.description,
            rating: item.imdbRatingValue,
            votes: item.imdbRatingCount,
            cover: item.cover?.url,
            thumbnail: item.cover?.url || item.stills?.url,
            detailPath: item.detailPath
        }));
        
        if (year) {
            const exactMatch = results.find(r => r.year === year);
            if (exactMatch) return [exactMatch];
        }
        
        return results;
    } catch (error) {
        console.error('MovieBox search error:', error.message);
        return [];
    }
};

// Search MovieBox by IMDb ID
export const searchMovieBoxByImdbId = async (imdbId) => {
    const cleanImdbId = imdbId.replace('tt', '');
    
    try {
        const payload = {
            keyword: cleanImdbId,
            page: 1,
            perPage: 5,
            subjectType: 0
        };
        
        let response = null;
        
        for (const host of MIRROR_HOSTS) {
            try {
                response = await makeApiRequest(`https://${host}/wefeed-h5-bff/web/subject/search`, {
                    method: 'POST',
                    data: payload,
                    timeout: 10000
                });
                if (response) break;
            } catch (error) {
                continue;
            }
        }
        
        if (!response) return null;
        
        const content = processApiResponse(response);
        const items = content.items || [];
        
        if (items.length > 0) {
            const item = items[0];
            return {
                id: item.subjectId || item.id,
                title: item.title,
                type: item.subjectType === 1 ? 'movie' : 'tv',
                year: item.year,
                detailPath: item.detailPath
            };
        }
        
        return null;
    } catch (error) {
        console.error('MovieBox IMDb search error:', error.message);
        return null;
    }
};

// Get streaming sources for a MovieBox ID
export const getMovieBoxSources = async (movieboxId, season = 0, episode = 0) => {
    console.log(`🔍 Getting sources for MovieBox ID: ${movieboxId}, S:${season}, E:${episode}`);
    
    try {
        // First get detailPath
        let detailPath = null;
        let workingHost = null;
        
        for (const host of MIRROR_HOSTS) {
            try {
                console.log(`Fetching details from host: ${host}`);
                const infoResponse = await makeApiRequest(`https://${host}/wefeed-h5-bff/web/subject/detail`, {
                    method: 'GET',
                    params: { subjectId: movieboxId },
                    timeout: 10000
                });
                
                if (infoResponse && infoResponse.data) {
                    const info = processApiResponse(infoResponse);
                    if (info.subject) {
                        detailPath = info.subject.detailPath;
                        workingHost = host;
                        console.log(`✅ Found detailPath: ${detailPath} on host: ${host}`);
                        break;
                    }
                }
            } catch (error) {
                console.log(`❌ Detail fetch failed for host ${host}:`, error.message);
                continue;
            }
        }
        
        if (!detailPath || !workingHost) {
            console.log('❌ Could not get detailPath from any host');
            return [];
        }
        
        let sourcesData = null;
        let lastError = null;
        
        // Try different endpoint paths and referer domains
        for (const endpoint of ALTERNATIVE_ENDPOINTS) {
            for (const refererDomain of REFERER_DOMAINS) {
                try {
                    // Rotate session ID occasionally
                    if (Math.random() > 0.7) {
                        currentSessionId = generateSessionId();
                    }
                    
                    const refererUrl = detailPath 
                        ? `${refererDomain}/spa/videoPlayPage/movies/${detailPath}?id=${movieboxId}&type=/movie/detail`
                        : `${refererDomain}/spa/videoPlayPage/`;
                    
                    const params = {
                        subjectId: movieboxId,
                        se: season,
                        ep: episode,
                        _t: Date.now() // Add timestamp to bypass cache
                    };
                    
                    console.log(`Trying ${workingHost}${endpoint} with referer ${refererDomain}`);
                    
                    // Generate fresh headers for this attempt
                    const headers = {
                        ...getEnhancedHeaders(workingHost, refererUrl),
                        'Origin': refererDomain,
                        'Sec-Fetch-Site': 'cross-site'
                    };
                    
                    const response = await makeApiRequest(`https://${workingHost}${endpoint}`, {
                        method: 'GET',
                        params: params,
                        headers: headers,
                        timeout: 15000
                    });
                    
                    if (response && response.data) {
                        const content = processApiResponse(response);
                        if (content && content.downloads && content.downloads.length > 0) {
                            sourcesData = content;
                            console.log(`✅ Found ${content.downloads.length} sources with ${endpoint}`);
                            break;
                        }
                    }
                } catch (error) {
                    lastError = error;
                    console.log(`❌ Failed:`, error.message);
                    continue;
                }
            }
            if (sourcesData) break;
        }
        
        // Fallback: Try a completely different approach - use search API
        if (!sourcesData || !sourcesData.downloads) {
            console.log('🔄 Trying fallback approach...');
            
            try {
                const fallbackResponse = await makeApiRequest(`https://${workingHost}/wefeed-h5-bff/web/subject/search`, {
                    method: 'POST',
                    data: {
                        keyword: movieboxId.toString(),
                        page: 1,
                        perPage: 1,
                        subjectType: 0
                    },
                    timeout: 10000
                });
                
                if (fallbackResponse && fallbackResponse.data) {
                    const content = processApiResponse(fallbackResponse);
                    if (content.items && content.items[0] && content.items[0].resource) {
                        const resource = content.items[0].resource;
                        if (resource.downloads) {
                            sourcesData = resource;
                            console.log(`✅ Found ${resource.downloads.length} sources via fallback`);
                        }
                    }
                }
            } catch (fallbackError) {
                console.log('❌ Fallback failed:', fallbackError.message);
            }
        }
        
        if (!sourcesData || !sourcesData.downloads) {
            console.log('❌ No sources found after all attempts');
            return [];
        }
        
        return sourcesData.downloads.map(file => ({
            id: file.id,
            quality: file.resolution ? file.resolution + 'p' : 'Unknown',
            size: file.size,
            url: file.url,
            streamUrl: `/api/moviebox/stream?url=${encodeURIComponent(file.url)}`,
            downloadUrl: `/api/moviebox/download?url=${encodeURIComponent(file.url)}`
        }));
        
    } catch (error) {
        console.error('❌ Get sources error:', error.message);
        return [];
    }
};

// Find MovieBox ID from TMDB data
export const findMovieBoxId = async (tmdbData) => {
    console.log('🔍 Finding MovieBox ID for:', tmdbData.title || tmdbData.name);
    
    if (tmdbData.imdb_id) {
        console.log('Trying IMDb ID:', tmdbData.imdb_id);
        const result = await searchMovieBoxByImdbId(tmdbData.imdb_id);
        if (result) {
            console.log('✅ Found by IMDb ID:', result);
            return result;
        }
    }
    
    const title = tmdbData.title || tmdbData.name;
    const year = tmdbData.release_date?.substring(0, 4) || tmdbData.first_air_date?.substring(0, 4);
    
    if (title) {
        console.log('Trying title:', title, 'year:', year);
        const results = await searchMovieBox(title, year ? parseInt(year) : null);
        if (results.length > 0) {
            console.log('✅ Found by title:', results[0]);
            return results[0];
        }
    }
    
    console.log('❌ No match found');
    return null;
};