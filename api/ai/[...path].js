import https from 'node:https';

const AI_SERVICE_HOST = 'aicommerce-ai-service-production.up.railway.app';

// Keep the body untouched so multipart document uploads reach Railway intact.
export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  const pathParts = Array.isArray(req.query.path) ? req.query.path : [req.query.path];
  const path = pathParts.filter(Boolean).join('/');
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(req.query)) {
    if (key === 'path' || value === undefined) continue;
    for (const item of Array.isArray(value) ? value : [value]) {
      query.append(key, item);
    }
  }

  const upstream = https.request({
    hostname: AI_SERVICE_HOST,
    method: req.method,
    path: `/${path}${query.size ? `?${query}` : ''}`,
    headers: {
      ...req.headers,
      host: AI_SERVICE_HOST,
    },
  }, (upstreamResponse) => {
    res.statusCode = upstreamResponse.statusCode || 502;
    for (const [header, value] of Object.entries(upstreamResponse.headers)) {
      if (value !== undefined) res.setHeader(header, value);
    }
    upstreamResponse.pipe(res);
  });

  upstream.on('error', (error) => {
    console.error('AI proxy request failed:', error);
    if (!res.headersSent) {
      res.status(502).json({ detail: 'AI service is temporarily unavailable.' });
    } else {
      res.end();
    }
  });

  req.pipe(upstream);
}
