const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 443;

// Middleware to handle CORS (should be before any other middleware)
app.use((req, res, next) => {
  console.log('Incoming request to:', req.url);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Proxy middleware
app.use('/api', createProxyMiddleware({
  target: 'https://pro-api.coinmarketcap.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '', // remove /api from the path
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log('Proxying request to:', proxyReq.path);
    const apiKey = process.env.CMC_API_KEY;
    if (apiKey) {
      proxyReq.setHeader('X-CMC_PRO_API_KEY', apiKey);
      console.log('Added API key to headers:', apiKey);
    } else {
      console.error('API key is missing from environment variables');
    }
    console.log('Outgoing request headers:', proxyReq.getHeaders());
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log('Response status from API:', proxyRes.statusCode);
    console.log('Response headers:', proxyRes.headers);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).send('Proxy error occurred. Please try again later.');
  },
}));

// Start the proxy server
app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});
