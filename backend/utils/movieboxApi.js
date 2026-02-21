import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

// Configuration
const MIRROR_HOSTS = [
    "h5.aoneroom.com",
    "movieboxapp.in", 
    "moviebox.pk",
    "moviebox.ph",
    "moviebox.id",
    "v.moviebox.ph"
];

// Headers configuration
const DEFAULT_HEADERS = {
    'X-Client-Info': '{"timezone":"Africa/Nairobi"}',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept': 'application/json',
    'User-Agent': 'okhttp/4.12.0',
    'Connection': 'keep-alive',
    'X-Forwarded-For': '1.1.1.1',
    'CF-Connecting-IP': '1.1.1.1',
    'X-Real-IP': '1.1.1.1'
};

// Session management
const jar = new CookieJar();
const axiosInstance = wrapper(axios.create({
    jar,
    withCredentials: true,
    timeout: 30000
}));

let cookiesInitialized = false;
let lastRequestTime = 0;
const RATE_LIMIT_DELAY = 3000; // 3 seconds between requests

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
        for (const host of MIRROR_HOSTS) {
            try {
                await rateLimit();
                const response = await axiosInstance.get(`https://${host}/wefeed-h5-bff/app/get-latest-app-pkgs?app_name=moviebox`, {
                    headers: { ...DEFAULT_HEADERS, Host: host }
                });
                
                if (response && response.data) {
                    console.log(`MovieBox session initialized with host: ${host}`);
                    cookiesInitialized = true;
                    return true;
                }
            } catch (error) {
                console.log(`Failed to initialize with host ${host}:`, error.message);
                continue;
            }
        }
    }
    return cookiesInitialized;
}

async function makeApiRequest(url, options = {}) {
    await ensureCookiesAreAssigned();
    await rateLimit();
    
    const config = {
        url: url,
        headers: { ...DEFAULT_HEADERS, ...options.headers },
        withCredentials: true,
        ...options
    };
    
    const response = await axiosInstance(config);
    return response;
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
        
        for (const host of MIRROR_HOSTS) {
            try {
                response = await makeApiRequest(`https://${host}/wefeed-h5-bff/web/subject/search`, {
                    method: 'POST',
                    data: payload,
                    headers: { Host: host }
                });
                if (response) break;
            } catch (error) {
                continue;
            }
        }
        
        if (!response) return [];
        
        const content = processApiResponse(response);
        
        // Format results
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
        
        // If year provided, try to match by year
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
    // Remove 'tt' prefix if present
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
                    headers: { Host: host }
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
    try {
        // First get detailPath
        let detailPath = null;
        
        for (const host of MIRROR_HOSTS) {
            try {
                const infoResponse = await makeApiRequest(`https://${host}/wefeed-h5-bff/web/subject/detail`, {
                    method: 'GET',
                    params: { subjectId: movieboxId },
                    headers: { Host: host }
                });
                
                if (infoResponse && infoResponse.data) {
                    const info = processApiResponse(infoResponse);
                    if (info.subject) {
                        detailPath = info.subject.detailPath;
                        break;
                    }
                }
            } catch (error) {
                continue;
            }
        }
        
        // Get download sources
        const refererDomains = [
            'https://fmoviesunblocked.net',
            'https://fmovies.to',
            'https://moviebox.ph',
            'https://moviebox.pk'
        ];
        
        let sourcesData = null;
        
        for (const host of MIRROR_HOSTS) {
            for (const refererDomain of refererDomains) {
                try {
                    const refererUrl = detailPath 
                        ? `${refererDomain}/spa/videoPlayPage/movies/${detailPath}?id=${movieboxId}&type=/movie/detail`
                        : `${refererDomain}/spa/videoPlayPage/`;
                    
                    const params = {
                        subjectId: movieboxId,
                        se: season,
                        ep: episode
                    };
                    
                    const response = await makeApiRequest(`https://${host}/wefeed-h5-bff/web/subject/download`, {
                        method: 'GET',
                        params: params,
                        headers: {
                            'Host': host,
                            'Referer': refererUrl,
                            'Origin': refererDomain
                        },
                        timeout: 15000
                    });
                    
                    if (response && response.data) {
                        const content = processApiResponse(response);
                        if (content && content.downloads && content.downloads.length > 0) {
                            sourcesData = content;
                            break;
                        }
                    }
                } catch (error) {
                    continue;
                }
            }
            if (sourcesData) break;
        }
        
        if (!sourcesData || !sourcesData.downloads) {
            return [];
        }
        
        // Format sources
        return sourcesData.downloads.map(file => ({
            id: file.id,
            quality: file.resolution ? file.resolution + 'p' : 'Unknown',
            size: file.size,
            url: file.url,
            streamUrl: `/api/moviebox/stream?url=${encodeURIComponent(file.url)}`,
            downloadUrl: `/api/moviebox/download?url=${encodeURIComponent(file.url)}`
        }));
        
    } catch (error) {
        console.error('Get sources error:', error.message);
        return [];
    }
};

// Find MovieBox ID from TMDB data
export const findMovieBoxId = async (tmdbData) => {
    // Try by IMDb ID first (most reliable)
    if (tmdbData.imdb_id) {
        const result = await searchMovieBoxByImdbId(tmdbData.imdb_id);
        if (result) return result;
    }
    
    // Try by title + year
    const title = tmdbData.title || tmdbData.name;
    const year = tmdbData.release_date?.substring(0, 4) || tmdbData.first_air_date?.substring(0, 4);
    
    if (title) {
        const results = await searchMovieBox(title, year ? parseInt(year) : null);
        if (results.length > 0) {
            return results[0];
        }
    }
    
    return null;
};